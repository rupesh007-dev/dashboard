import { CircleCheckBig } from 'lucide-react';
import { useState } from 'react';
import { Slicestring } from '../../../../components/common/Slicestring';
import AppTooltip from '../../../../components/common/Tooltip';

export const DeliveryView = ({ programId, deliveryData, onBack }) => {
  let tableData = [];
  try {
    tableData = JSON.parse(deliveryData.data);
  } catch (e) {
    console.error('Invalid JSON in deliveryData.data', e);
  }

  console.log(deliveryData, 'deliveryData');

  const columns = Array.isArray(tableData) && tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
        <button
          onClick={onBack}
          className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          ← Back
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Details</h2>
        <span className="text-sm text-gray-400 dark:text-gray-500">Campaign #{programId}</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{deliveryData.fileName}</h3>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-800 shadow-sm space-y-3 mb-6">
          <p>
            <strong>Submitted:</strong> {deliveryData.submitted}
          </p>
          <p>
            <strong>Accepted:</strong> {deliveryData.accepted}
          </p>
          <p>
            <strong>Errors:</strong> {deliveryData.errors}
          </p>
          <p>
            <strong>Rejections:</strong> {deliveryData.rejections}
          </p>
          <p>
            <strong>Date:</strong> {deliveryData.date}
          </p>
        </div>

        {/* Table view */}
        {Array.isArray(tableData) && tableData.length > 0 ? (
          <div className="overflow-x-auto mx-auto mt-6 max-w-8xl rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-2 py-1 border-b border-gray-200 dark:border-gray-700 font-semibold whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                  >
                    {columns.map((col) => (
                      <td key={col} className="px-2 py-1 text-gray-800 dark:text-gray-200 truncate max-w-37.5">
                        {typeof row[col] === 'object' ? JSON.stringify(row[col]) : (row[col] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm text-center">No valid table data available.</p>
        )}
      </div>
    </div>
  );
};

export const UploadTable = ({ data, programId }) => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  console.log(data, 'UploadTable');

  if (selectedDelivery) {
    return (
      <DeliveryView campaignId={programId} deliveryData={selectedDelivery} onBack={() => setSelectedDelivery(null)} />
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-sm p-4 lg:p-6">
      <div className="overflow-x-auto">
        <table className="w-full rounded-lg text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr>
              <th className="p-3 font-medium">UPLOADS</th>
              <th className="p-3 font-medium"></th>
              <th className="p-3 font-medium">SUBMITTED</th>
              <th className="p-3 font-medium">ACCEPTED</th>
              <th className="p-3 font-medium">ERRORS</th>
              <th className="p-3 font-medium">REJECTIONS</th>
              <th className="p-3 font-medium">VIEW</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((u) => (
              <tr
                key={u.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="p-3">
                  <div className="flex flex-col">
                    <AppTooltip message={u.name}>
                      <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                        {Slicestring(u.fileName, 1, 25)}
                        {u.fileName.length > 25 && '...'}
                      </p>
                    </AppTooltip>
                    <span className="text-gray-500 dark:text-gray-400 text-xs mt-1">{u.date}</span>
                  </div>
                </td>
                <td className="p-3 text-center text-gray-400">
                  <CircleCheckBig color="#00D100" />
                </td>
                <td className="p-3 text-center text-gray-900 dark:text-white">{u.submitted}</td>
                <td className="p-3 text-center text-gray-900 dark:text-white">{u.accepted}</td>
                <td className="p-3 text-center text-gray-900 dark:text-white">{u.errors}</td>
                <td className="p-3 text-center text-gray-900 dark:text-white">{u.rejections}</td>
                <td
                  className="p-3 text-center text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                  onClick={() => setSelectedDelivery(u)}
                >
                  View
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
