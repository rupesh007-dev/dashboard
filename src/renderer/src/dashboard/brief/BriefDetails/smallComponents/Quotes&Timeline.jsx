import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import 'jsuites/dist/jsuites.css';
import { Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const SingleQuote = ({ data, briefId, onUpdated, authorisedUser }) => {
  const leadSheetRef = useRef(null);

  const [leadSheetInstance, setLeadSheetInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.value);

  let normalizedData = [];

  if (Array.isArray(data?.data)) {
    const first = data?.data[0];

    if (first && typeof first === 'object' && !Array.isArray(first) && Object.keys(first).length === 1) {
      const templateKey = Object.keys(first)[0];
      const inner = first[templateKey];

      if (Array.isArray(inner)) {
        normalizedData = inner;
      }
    } else if (data?.data.every((item) => typeof item === 'object' && !Array.isArray(item))) {
      normalizedData = data?.data;
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
      const allLeadCountDetails = parseSheetData(leadSheetInstance);

      // const finalPayload = {
      //   name:[]
      // };
      // const allLeadCountDetails = parseSheetData(leadSheetInstance);
      const jsonData = {
        updatedOn: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        updatedBy: user.username,
        data: allLeadCountDetails,
      };

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/briefs/${briefId}/quotes/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });

      if (!res.ok) throw new Error('Update failed');
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/briefs/${briefId}/quotes/${data.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      onUpdated();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="border rounded-xl p-4 space-y-4 bg-gray-50">
      <div className="flex justify-between">
        <div>
          <p>
            <strong>Quoted On:</strong> {data.quotedOn}
          </p>
          <p>
            <strong>Updated On:</strong> {data.updatedOn}
          </p>
          <p>
            <strong>Quoted By:</strong> {data.quotedBy}
          </p>
          <p>
            <strong>Updated By:</strong> {data.updatedBy}
          </p>
        </div>

        {authorisedUser && (
          <button onClick={handleDelete} className="text-red-600 hover:text-red-800">
            <Trash />
          </button>
        )}
      </div>

      <Spreadsheet ref={leadSheetRef} tabs={false} onload={setLeadSheetInstance}>
        <Worksheet worksheetName="Quote" minDimensions={[5, 3]} />
      </Spreadsheet>

      {authorisedUser && (
        <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded-xl" disabled={loading}>
          {loading ? 'Updating...' : 'Update Quote'}
        </button>
      )}
    </div>
  );
};

const QuotesAndTimeline = ({ briefId }) => {
  const user = useSelector((state) => state.user.value);
  const authorisedUser = ['admin', 'superAdmin'].includes(user.role);

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const addSheetRef = useRef(null);
  const [leadSheetInstance, setLeadSheetInstance] = useState(null);
  const fetchQuotes = async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/briefs/${briefId}`);
    const data = await res.json();

    setQuotes(data?.data?.quotes || []);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

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
  const handleAddQuote = async () => {
    setLoading(true);
    try {
      const allLeadCountDetails = parseSheetData(leadSheetInstance);

      const payload = {
        quotedOn: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        updatedOn: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        quotedBy: user.username,
        updatedBy: user.username,
        data: allLeadCountDetails,
      };
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/briefs/${briefId}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Add quote failed');
      await fetchQuotes();
      setAdding(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="border rounded-2xl border-gray-200 bg-white p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-lg">Quotes & Timeline</h1>
        <button onClick={() => setAdding(true)} className="px-4 py-2 rounded bg-blue-600 text-white">
          Add Quote
        </button>
      </div>

      {adding && (
        <div className="space-y-4 border p-4 rounded-xl bg-gray-50">
          <Spreadsheet ref={addSheetRef} tabs={false} onload={setLeadSheetInstance}>
            <Worksheet worksheetName="AddQuote" minDimensions={[5, 3]} />
          </Spreadsheet>
          <button onClick={handleAddQuote} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-xl">
            {loading ? 'Saving...' : 'Save Quote'}
          </button>
        </div>
      )}

      {quotes.map((q) => (
        <SingleQuote key={q.id} data={q} briefId={briefId} onUpdated={fetchQuotes} authorisedUser={authorisedUser} />
      ))}
    </div>
  );
};

export default QuotesAndTimeline;
