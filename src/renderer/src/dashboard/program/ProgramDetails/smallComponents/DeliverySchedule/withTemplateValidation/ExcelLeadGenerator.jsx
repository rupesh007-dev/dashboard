import { useState } from 'react';
import * as XLSX from 'xlsx';
import ExcelAssignedTemplateGenerator from './ExcelAssignedTemplateGenerator';

const toCamelCase = (str) =>
  str
    .replace(/\u00A0/g, ' ')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

const ExcelTemplateGenerator = ({ onSchemaGenerated }) => {
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = rows[0];

      const headersWithValues = {};
      headers.forEach((header, colIdx) => {
        const values = rows
          .slice(1)
          .map((row) => row[colIdx])
          .filter(Boolean);
        headersWithValues[toCamelCase(header)] = Array.from(new Set(values));
      });

      const generator = new ExcelAssignedTemplateGenerator(headers, headersWithValues);
      let schema = generator.generateValidationJson();

      if (schema.valueRules) {
        schema.valueRules = schema.valueRules.map((vr) => ({
          ...vr,
          fieldNames: vr.fieldNames.map((fn) => fn),
        }));
      }

      if (onSchemaGenerated) {
        onSchemaGenerated(schema);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Excel File:</label>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200"
      />
      {fileName && <p className="my-3">File: {fileName}</p>}
    </div>
  );
};

export default ExcelTemplateGenerator;
