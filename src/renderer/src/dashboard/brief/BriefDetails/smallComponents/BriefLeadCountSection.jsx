import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import 'jsuites/dist/jsuites.css';
import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function BriefLeadCountSection({ data, briefId }) {
  const leadSheetRef = useRef(null);
  const [leadSheetInstance, setLeadSheetInstance] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user.value);
  const authorisedUser = ['admin', 'superAdmin'].includes(user.role);

  let normalizedData = [];

  if (Array.isArray(data)) {
    const first = data[0];

    if (first && typeof first === 'object' && !Array.isArray(first) && Object.keys(first).length === 1) {
      const templateKey = Object.keys(first)[0];
      const inner = first[templateKey];

      if (Array.isArray(inner)) {
        normalizedData = inner;
      }
    } else if (data.every((item) => typeof item === 'object' && !Array.isArray(item))) {
      normalizedData = data;
    }
  }

  if (!Array.isArray(normalizedData)) normalizedData = [];

  const buildTable = () => {
    if (normalizedData.length === 0) return [[]];

    const headers = Object.keys(normalizedData[0]);
    const rows = normalizedData.map((row) => headers.map((h) => row[h] ?? ''));

    return [headers, ...rows];
  };

  useEffect(() => {
    if (!leadSheetInstance) return;

    const sheet = leadSheetInstance.worksheets[0];
    sheet.setData(buildTable());
  }, [leadSheetInstance, data]);

  const parseSheetData = (sheetInstance) => {
    if (!sheetInstance) return [];

    const sheet = sheetInstance.worksheets[0];
    const raw = sheet.getData();

    if (raw.length < 2) return [];

    const headers = raw[0];
    const rows = raw.slice(1);

    let result = [];

    rows.forEach((row) => {
      if (row.every((cell) => cell === '' || cell == null)) return;

      let obj = {};

      headers.forEach((header, index) => {
        let value = row[index];

        if (value === '' || value == null) {
          obj[header] = '';
        } else {
          const num = Number(value);
          obj[header] = isNaN(num) ? value : num;
        }
      });

      result.push(obj);
    });

    return result;
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const leadDetails = parseSheetData(leadSheetInstance);

      const jsonData = { leadDetails };

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/briefs/${briefId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });

      if (!res.ok) throw new Error('Update failed');
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  return (
    <div className="border rounded-2xl border-gray-200 bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-800 text-lg">Lead Count</h1>

        {authorisedUser && (
          <button
            onClick={handleUpdate}
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
        )}
      </div>

      {/* <Spreadsheet ref={leadSheetRef} tabs={false} onload={setLeadSheetInstance}>
        <Worksheet worksheetName="LeadCount" minDimensions={[5, 3]} />
      </Spreadsheet> */}
      {/* <div   style={{ width: '400px', height: '300px', overflow: 'hidden' }}> */}
      <Spreadsheet ref={leadSheetRef} tabs={false} onload={setLeadSheetInstance}>
        {/* <Worksheet worksheetName="LeadCount" minDimensions={[5, 3]} /> */}

        <Worksheet worksheetName="LeadCount" minDimensions={[5, 3]} tableWidth="400px" tableOverflow={true} />

        {/* <Worksheet  csv={"https://www.dropbox.com/scl/fi/flztt2akf0huwsst6n0j6/GT-Sushant-Sheet12.csv?rlkey=14b1cfuzdj47ckulje19v3z8d&st=ocbxllqy&dl=0"} csvHeaders/> */}

        {/* <Worksheet
          csv={
            'https://www.dropbox.com/scl/fi/flztt2akf0huwsst6n0j6/GT-Sushant-Sheet12.csv?rlkey=14b1cfuzdj47ckulje19v3z8d&st=ocbxllqy&raw=1'
          }
          csvHeaders={true} // Uses the first row of CSV as column titles
          tableWidth="100%"
          tableHeight="400px"
          tableOverflow={true}
        /> */}
      </Spreadsheet>
      {/* </div> */}
    </div>
  );
}
