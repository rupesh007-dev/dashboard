import { FileText, Download, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const downloadCSV = (rows, filename) => {
  if (!rows || rows.length === 0) return;

  const headers = new Set();
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (key !== '_errors') headers.add(key);
    });
    if (row._errors) headers.add('errors');
  });

  const headerArray = Array.from(headers);

  const csvRows = [
    headerArray.join(','),
    ...rows.map((row) =>
      headerArray
        .map((key) => {
          if (key === 'errors') {
            return `"${JSON.stringify(row._errors || {})}"`;
          }
          const value = row[key] ?? '';
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};

export const UploadHistory = ({ pacingId }) => {
  const [uploadHistory, setUploadHistory] = useState([]);
  const [expandedUploadId, setExpandedUploadId] = useState(null);
  const [errorEdits, setErrorEdits] = useState({}); // map uploadId => errors[]

  const fetchHistory = useCallback(async () => {
    if (!pacingId) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/leadUploads/pacing/${pacingId}`);
      const data = await res.json();
      setUploadHistory(data.uploads || []);
    } catch (err) {
      console.error('Upload history fetch failed', err);
    }
  }, [pacingId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Handle input edits inside error table for a given upload
  const handleEdit = (uploadId, rowIdx, field, value) => {
    setErrorEdits((prev) => {
      const copy = { ...prev };
      if (!copy[uploadId]) {
        copy[uploadId] = [];
      }
      // Make sure to clone errors array deeply
      if (!copy[uploadId][rowIdx]) {
        copy[uploadId][rowIdx] = {};
      }
      // Update the row object
      copy[uploadId][rowIdx] = {
        ...copy[uploadId][rowIdx],
        [field]: value,
      };

      // Remove errors if field fixed
      const originalRowErrors = uploadHistory.find((u) => u.id === uploadId)?.results.errors?.[rowIdx]?._errors || {};

      if (originalRowErrors[field]) {
        // Remove this error if fixed
        const errorArray = originalRowErrors[field];
        // If value no longer causes error, remove error (you might want your own logic here)
        if (value.trim() !== '') {
          delete originalRowErrors[field];
        }
      }

      return copy;
    });
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg space-y-6">
      {uploadHistory.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No upload history found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {uploadHistory.map((upload) => {
            const errors = upload.results?.errors || [];
            const valid = upload.results?.validRowsCount || 0;
            const errorCount = upload.results?.errorRowsCount || 0;

            // Use edited errors if any, else original errors
            const currentErrors = errorEdits[upload.id]?.length === errors.length ? errorEdits[upload.id] : errors;

            const columns =
              currentErrors.length > 0 ? Object.keys(currentErrors[0]).filter((c) => c !== '_errors') : [];

            const errorColumns = new Set();
            currentErrors.forEach((row) => {
              if (row._errors) {
                Object.keys(row._errors).forEach((field) => errorColumns.add(field));
              }
            });

            const isExpanded = expandedUploadId === upload.id;

            return (
              <div
                key={upload.id}
                className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                {/* Upload summary header */}
                <div
                  className={`p-4 flex justify-between items-center cursor-pointer ${
                    isExpanded ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setExpandedUploadId(isExpanded ? null : upload.id)}
                >
                  <div className="flex items-center gap-3 max-w-[60%]">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">
                        {upload.filename}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Uploaded by:{' '}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {upload.uploader?.name || 'Unknown'}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {new Date(upload.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right text-xs font-semibold">
                      <div className="text-green-600">✓ {valid}</div>
                      <div className="text-red-600">✗ {errorCount}</div>
                    </div>

                    <button
                      disabled={errors.length === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadCSV(errors, `errors_${upload.filename}_${upload.id}.csv`);
                      }}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold transition
                        ${
                          errors.length === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                    >
                      <Download className="w-4 h-4" />
                      Errors CSV
                    </button>
                  </div>
                </div>

                {/* Inline error table for expanded upload */}
                {isExpanded && currentErrors.length > 0 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-600 overflow-auto max-h-105">
                    <table className="min-w-full text-sm border-collapse">
                      <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-700">
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
                        {currentErrors.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            {columns.map((col) => {
                              const hasError = row._errors?.[col];
                              return (
                                <td
                                  key={col}
                                  className={`p-2 border align-top ${
                                    hasError ? 'bg-red-50' : 'bg-white dark:bg-gray-800'
                                  }`}
                                >
                                  <input
                                    value={row[col] || ''}
                                    onChange={(e) => handleEdit(upload.id, rIdx, col, e.target.value)}
                                    className={`w-full px-2 py-1 rounded-md text-sm
                                    ${
                                      hasError
                                        ? 'border border-red-500 bg-red-50 focus:ring-red-400'
                                        : 'border border-gray-300 focus:ring-blue-400'
                                    }
                                    focus:outline-none focus:ring-2`}
                                  />
                                  {hasError && (
                                    <p className="mt-1 text-xs text-red-600">{row._errors[col].join(', ')}</p>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <p className="mt-3 text-xs text-gray-500">
                      🔴 Red columns indicate validation errors. Fix highlighted fields before re-uploading.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
