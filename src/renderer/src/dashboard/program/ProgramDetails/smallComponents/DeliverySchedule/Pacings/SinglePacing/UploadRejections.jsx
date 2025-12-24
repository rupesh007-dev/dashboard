import React, { useState } from 'react';

const UploadRejections = ({ pacingId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Parse CSV to JSON
  const parseCSV = async (file) => {
    const text = await file.text();
    const rows = text.trim().split('\n');
    const data = [];

    for (let i = 1; i < rows.length; i++) {
      const [email, reason] = rows[i].split(',');

      if (!email) continue;

      data.push({
        email: email.trim(),
        reason: reason ? reason.trim() : '',
      });
    }

    return data;
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a CSV file first.');
      return;
    }

    try {
      setLoading(true);

      // convert CSV → JSON
      const leads = await parseCSV(file);

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/bulkUpload/leads/rejections?pacingId=${pacingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads }),
      });

      const data = await res.json();
      alert('Rejections uploaded successfully!');
    } catch (error) {
      console.error(error);
      alert('Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg max-w-md">
      <h2 className="text-lg font-semibold mb-2">Upload Rejected Leads</h2>

      <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} className="mb-3" />

      <button onClick={uploadFile} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? 'Uploading...' : 'Upload CSV'}
      </button>
    </div>
  );
};

export default UploadRejections;
