// import { useEffect, useState, useContext } from "react";
// import { useSelector } from "react-redux";
// import {
//   Upload,
//   CheckCircle,
//   AlertCircle,
//   Download,
// } from "lucide-react";
// import { SocketContext } from "../../../../../../../context/SocketContext";

// /* ------------------ Stat Card ------------------ */
// const StatCard = ({ label, value, color }) => {
//   const map = {
//     green: "bg-green-50 text-green-700 border-green-200",
//     red: "bg-red-50 text-red-700 border-red-200",
//     blue: "bg-blue-50 text-blue-700 border-blue-200",
//   };
//   return (
//     <div className={`p-4 rounded-xl border ${map[color]}`}>
//       <p className="text-xs uppercase font-bold opacity-70">{label}</p>
//       <p className="text-2xl font-bold mt-1">{value}</p>
//     </div>
//   );
// };

// /* ======================================================
//    🔥 SINGLE COMPONENT
// ====================================================== */
// export default function UploadDrawer({ pacingId }) {
//   const user = useSelector((state) => state.user.value);
//   const socket = useContext(SocketContext);

//   const [file, setFile] = useState(null);
//   const [progress, setProgress] = useState([]);
//   const [results, setResults] = useState(null);
//   const [errorRows, setErrorRows] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState("");

//   /* ---------------- Socket Listener ---------------- */
//   useEffect(() => {
//     const onProgress = (data) => {
//       setProgress((prev) => {
//         const idx = prev.findIndex((p) => p.step === data.step);
//         if (idx !== -1) {
//           const copy = [...prev];
//           copy[idx] = data;
//           return copy;
//         }
//         return [...prev, data];
//       });

//       if (data.result) {
//         setResults(data.result);
//         setErrorRows(data.result.errors || []);
//       }
//     };

//     socket.on("validationProgress", onProgress);
//     return () => socket.off("validationProgress", onProgress);
//   }, [socket]);

//   /* ---------------- Upload ---------------- */
//   const uploadFile = async () => {
//     if (!file) return;
//     setIsUploading(true);
//     setProgress([]);
//     setResults(null);
//     setErrorRows([]);
//     setError("");

//     const form = new FormData();
//     form.append("file", file);
//     form.append("pacingId", pacingId);
//     form.append("uploadedBy", user.userId);

//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_BASE_URL}/bulk-upload/leads`,
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${user.token}` },
//           body: form,
//         }
//       );
//       if (!res.ok) {
//         const r = await res.json();
//         setError(r.message || "Upload failed");
//       }
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   /* ---------------- Editable Spreadsheet ---------------- */
//   const handleEdit = (rowIdx, field, value) => {
//     const copy = [...errorRows];
//     copy[rowIdx][field] = value;

//     if (copy[rowIdx]._errors?.[field]) {
//       delete copy[rowIdx]._errors[field];
//       if (!Object.keys(copy[rowIdx]._errors).length) {
//         delete copy[rowIdx]._errors;
//       }
//     }
//     setErrorRows(copy);
//   };

//   /* ---------------- Download CSV ---------------- */
//   const downloadErrors = async () => {
//     const res = await fetch(
//       `${import.meta.env.VITE_BASE_URL}/bulk-upload/download-errors`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ errors: errorRows }),
//       }
//     );

//     const blob = await res.blob();
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "error-leads.csv";
//     a.click();
//   };

//   /* ---------------- Columns & Error Columns ---------------- */
//   const columns =
//     errorRows.length > 0
//       ? Object.keys(errorRows[0]).filter((c) => c !== "_errors")
//       : [];

//   const errorColumns = new Set();
//   errorRows.forEach((row) => {
//     if (row._errors) {
//       Object.keys(row._errors).forEach((field) =>
//         errorColumns.add(field)
//       );
//     }
//   });

//   return (
//     <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg ">
//       <h2 className="text-2xl font-semibold mb-6">Bulk Lead Upload</h2>

//       {/* Upload */}
//       <div className="flex items-center gap-4 mb-6">
//         <input
//           type="file"
//           accept=".csv"
//           onChange={(e) => setFile(e.target.files[0])}
//           className="text-sm"
//         />
//         <button
//           disabled={!file || isUploading}
//           onClick={uploadFile}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:bg-gray-400"
//         >
//           <Upload className="w-4 h-4" />
//           Upload
//         </button>
//       </div>

//       {error && (
//         <div className="mb-4 text-red-600 flex items-center gap-2">
//           <AlertCircle className="w-4 h-4" /> {error}
//         </div>
//       )}

//       {/* Progress */}
//       <div className="space-y-3">
//         {progress.map((p) => (
//           <div
//             key={p.step}
//             className="p-3 rounded-lg border bg-white dark:bg-gray-700"
//           >
//             <div className="flex justify-between text-sm font-medium">
//               <span className="capitalize">{p.step}</span>
//               <span>{p.percentage}%</span>
//             </div>
//             <div className="h-2 mt-2 bg-gray-200 rounded">
//               <div
//                 className="h-2 bg-blue-600 rounded transition-all"
//                 style={{ width: `${p.percentage}%` }}
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Stats */}
//       {results && (
//         <div className="grid grid-cols-3 gap-6 mt-8">
//           <StatCard label="Total Rows" value={results.totalRows} color="blue" />
//           <StatCard
//             label="Valid Leads"
//             value={results.validRowsCount}
//             color="green"
//           />
//           <StatCard
//             label="Error Leads"
//             value={results.errorRowsCount}
//             color="red"
//           />
//         </div>
//       )}

//       {/* Error Spreadsheet */}
//       {errorRows.length > 0 && (
//         <div className="mt-10">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-semibold text-red-600">
//               Fix Error Leads
//             </h3>
//             <button
//               onClick={downloadErrors}
//               className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//             >
//               <Download className="w-4 h-4" />
//               Download Error CSV
//             </button>
//           </div>

//           <div className="overflow-auto border rounded-xl max-h-[420px]">
//             <table className="min-w-full text-sm border-collapse">
//               <thead className="sticky top-0 z-10">
//                 <tr>
//                   {columns.map((col) => (
//                     <th
//                       key={col}
//                       className={`p-3 border text-left font-semibold uppercase text-xs tracking-wide
//                         ${
//                           errorColumns.has(col)
//                             ? "bg-red-100 text-red-700"
//                             : "bg-gray-100 dark:bg-gray-700"
//                         }`}
//                     >
//                       {col}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {errorRows.map((row, rIdx) => (
//                   <tr
//                     key={rIdx}
//                     className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//                   >
//                     {columns.map((col) => {
//                       const hasError = row._errors?.[col];
//                       return (
//                         <td
//                           key={col}
//                           className={`p-2 border align-top ${
//                             hasError
//                               ? "bg-red-50"
//                               : "bg-white dark:bg-gray-800"
//                           }`}
//                         >
//                           <input
//                             value={row[col] || ""}
//                             onChange={(e) =>
//                               handleEdit(rIdx, col, e.target.value)
//                             }
//                             className={`w-full px-2 py-1 rounded-md text-sm
//                               ${
//                                 hasError
//                                   ? "border border-red-500 bg-red-50 focus:ring-red-400"
//                                   : "border border-gray-300 focus:ring-blue-400"
//                               }
//                               focus:outline-none focus:ring-2`}
//                           />
//                           {hasError && (
//                             <p className="mt-1 text-xs text-red-600">
//                               {row._errors[col].join(", ")}
//                             </p>
//                           )}
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <p className="mt-3 text-xs text-gray-500">
//             🔴 Red columns indicate validation errors. Fix highlighted
//             fields before re-uploading.
//           </p>
//         </div>
//       )}

//       {/* Valid Leads Preview */}
//       {results?.validData?.length > 0 && (
//         <div className="mt-10">
//           <h3 className="text-xl font-semibold text-green-600 mb-3">
//             Valid Leads Preview
//           </h3>
//           <ul className="text-sm max-h-40 overflow-auto space-y-1">
//             {results.validData.map((l, i) => (
//               <li key={i} className="flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4 text-green-500" />
//                 {l.email}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Upload, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { SocketContext } from '../../../../../../../context/SocketContext';

import { UploadHistory } from './UploadHistory'; // import upload history

const StatCard = ({ label, value, color }) => {
  const map = {
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  };
  return (
    <div className={`p-4 rounded-xl border ${map[color]}`}>
      <p className="text-xs uppercase font-bold opacity-70">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default function UploadDrawer({ pacingId }) {
  const user = useSelector((state) => state.user.value);
  const socket = useContext(SocketContext);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState([]);
  const [results, setResults] = useState(null);
  const [errorRows, setErrorRows] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // <-- tab state

  /* ---------------- Socket Listener ---------------- */
  useEffect(() => {
    const onProgress = (data) => {
      setProgress((prev) => {
        const idx = prev.findIndex((p) => p.step === data.step);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = data;
          return copy;
        }
        return [...prev, data];
      });

      if (data.result) {
        setResults(data.result);
        setErrorRows(data.result.errors || []);
      }
    };

    socket.on('validationProgress', onProgress);
    return () => socket.off('validationProgress', onProgress);
  }, [socket]);

  /* ---------------- Upload ---------------- */
  const uploadFile = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress([]);
    setResults(null);
    setErrorRows([]);
    setError('');

    const form = new FormData();
    form.append('file', file);
    form.append('pacingId', pacingId);
    form.append('uploadedBy', user.userId);

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/bulk-upload/leads`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: form,
      });
      if (!res.ok) {
        const r = await res.json();
        setError(r.message || 'Upload failed');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setIsUploading(false);
    }
  };

  /* ---------------- Editable Spreadsheet ---------------- */
  const handleEdit = (rowIdx, field, value) => {
    const copy = [...errorRows];
    copy[rowIdx][field] = value;

    if (copy[rowIdx]._errors?.[field]) {
      delete copy[rowIdx]._errors[field];
      if (!Object.keys(copy[rowIdx]._errors).length) {
        delete copy[rowIdx]._errors;
      }
    }
    setErrorRows(copy);
  };

  /* ---------------- Download CSV ---------------- */
  const downloadErrors = async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/bulk-upload/download-errors`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ errors: errorRows }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'error-leads.csv';
    a.click();
  };

  /* ---------------- Columns & Error Columns ---------------- */
  const columns = errorRows.length > 0 ? Object.keys(errorRows[0]).filter((c) => c !== '_errors') : [];

  const errorColumns = new Set();
  errorRows.forEach((row) => {
    if (row._errors) {
      Object.keys(row._errors).forEach((field) => errorColumns.add(field));
    }
  });

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg ">
      <h2 className="text-2xl font-semibold mb-6">Bulk Lead Upload</h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-300 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upload')}
          className={`pb-2 font-semibold ${
            activeTab === 'upload'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Upload
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 font-semibold ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Upload History
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'upload' && (
        <>
          {/* Upload Input */}
          <div className="flex items-center gap-4 mb-6">
            <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
            <button
              disabled={!file || isUploading}
              onClick={uploadFile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:bg-gray-400"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>

          {error && (
            <div className="mb-4 text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          {/* Progress */}
          <div className="space-y-3">
            {progress.map((p) => (
              <div key={p.step} className="p-3 rounded-lg border bg-white dark:bg-gray-700">
                <div className="flex justify-between text-sm font-medium">
                  <span className="capitalize">{p.step}</span>
                  <span>{p.percentage}%</span>
                </div>
                <div className="h-2 mt-2 bg-gray-200 rounded">
                  <div className="h-2 bg-blue-600 rounded transition-all" style={{ width: `${p.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          {results && (
            <div className="grid grid-cols-3 gap-6 mt-8">
              <StatCard label="Total Rows" value={results.totalRows} color="blue" />
              <StatCard label="Valid Leads" value={results.validRowsCount} color="green" />
              <StatCard label="Error Leads" value={results.errorRowsCount} color="red" />
            </div>
          )}

          {/* Error Spreadsheet */}
          {errorRows.length > 0 && (
            <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-red-600">Fix Error Leads</h3>
                <button
                  onClick={downloadErrors}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Error CSV
                </button>
              </div>

              <div className="overflow-auto border rounded-xl max-h-105">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className={`p-3 border text-left font-semibold uppercase text-xs tracking-wide
                            ${errorColumns.has(col) ? 'bg-red-100 text-red-700' : 'bg-gray-100 dark:bg-gray-700'}`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {errorRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        {columns.map((col) => {
                          const hasError = row._errors?.[col];
                          return (
                            <td
                              key={col}
                              className={`p-2 border align-top ${hasError ? 'bg-red-50' : 'bg-white dark:bg-gray-800'}`}
                            >
                              <input
                                value={row[col] || ''}
                                onChange={(e) => handleEdit(rIdx, col, e.target.value)}
                                className={`w-full px-2 py-1 rounded-md text-sm
                                  ${
                                    hasError
                                      ? 'border border-red-500 bg-red-50 focus:ring-red-400'
                                      : 'border border-gray-300 focus:ring-blue-400'
                                  }
                                  focus:outline-none focus:ring-2`}
                              />
                              {hasError && <p className="mt-1 text-xs text-red-600">{row._errors[col].join(', ')}</p>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                🔴 Red columns indicate validation errors. Fix highlighted fields before re-uploading.
              </p>
            </div>
          )}

          {/* Valid Leads Preview */}
          {results?.validData?.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold text-green-600 mb-3">Valid Leads Preview</h3>
              <ul className="text-sm max-h-40 overflow-auto space-y-1">
                {results.validData.map((l, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {l.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {activeTab === 'history' && (
        <div>
          <UploadHistory pacingId={pacingId} />
        </div>
      )}
    </div>
  );
}
