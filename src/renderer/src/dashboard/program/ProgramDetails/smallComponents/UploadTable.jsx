// import { useState } from 'react';
// import { Slicestring } from '../../../../components/common/Slicestring';
// import AppTooltip from '../../../../components/common/Tooltip';
// import { FormatDate } from '../../../../components/common/FormatDate';

// import * as XLSX from 'xlsx'; // Ensure xlsx is installed
// import { CircleCheckBig, Download, Eye } from 'lucide-react';

// export const DeliveryView = ({ programId, deliveryData, onBack }) => {
//   let tableData = [];
//   try {
//     tableData = JSON.parse(deliveryData.data);
//   } catch (e) {
//     console.error('Invalid JSON in deliveryData.data', e);
//   }

//   const columns = Array.isArray(tableData) && tableData.length > 0 ? Object.keys(tableData[0]) : [];

//   console.log(deliveryData, 'deliveryData');

//   return (
//     <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900 overflow-y-auto">
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
//         <button
//           onClick={onBack}
//           className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
//         >
//           ← Back
//         </button>
//         <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Details</h2>
//         <span className="text-sm text-gray-400 dark:text-gray-500">Campaign #{programId}</span>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6">
//         <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{deliveryData.fileName}</h3>

//         <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-800 shadow-sm space-y-3 mb-6">
//           <p>
//             <strong>Submitted:</strong> {deliveryData.submitted}
//           </p>
//           <p>
//             <strong>Accepted:</strong> {deliveryData.accepted}
//           </p>
//           <p>
//             <strong>Errors:</strong> {deliveryData.errors}
//           </p>
//           <p>
//             <strong>Rejections:</strong> {deliveryData.rejections}
//           </p>
//           <p>
//             <strong>Date:</strong>

//             {FormatDate(deliveryData.date)}
//           </p>
//         </div>

//         {/* Table view */}
//         {Array.isArray(tableData) && tableData.length > 0 ? (
//           <div className="overflow-x-auto mx-auto mt-6 max-w-8xl rounded-lg border border-gray-200 dark:border-gray-700">
//             <table className="w-full text-xs text-left border-collapse">
//               <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase">
//                 <tr>
//                   {columns.map((col) => (
//                     <th
//                       key={col}
//                       className="px-2 py-1 border-b border-gray-200 dark:border-gray-700 font-semibold whitespace-nowrap"
//                     >
//                       {col}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {tableData.map((row, idx) => (
//                   <tr
//                     key={idx}
//                     className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
//                   >
//                     {columns.map((col) => (
//                       <td key={col} className="px-2 py-1 text-gray-800 dark:text-gray-200 truncate max-w-37.5">
//                         {typeof row[col] === 'object' ? JSON.stringify(row[col]) : (row[col] ?? '—')}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-gray-500 dark:text-gray-400 mt-6 text-sm text-center">No valid table data available.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export const UploadTable = ({ data, programId }) => {
//   const [selectedDelivery, setSelectedDelivery] = useState(null);

//   const handleExport = (upload) => {
//     // 1. Check if there is data to export
//     // If 'upload.leads' exists, use that. Otherwise, we export the summary row.
//     const exportSource = upload.leads || [
//       {
//         FileName: upload.fileName,
//         Date: upload.date,
//         Submitted: upload.submitted,
//         Accepted: upload.accepted,
//         Errors: upload.errors,
//         Rejections: upload.rejections,
//       },
//     ];

//     try {
//       // 2. Create worksheet
//       const worksheet = XLSX.utils.json_to_sheet(exportSource);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, 'Upload Details');

//       // 3. Generate filename
//       const cleanFileName = upload.fileName.split('.')[0] || 'export';
//       const dateSuffix = new Date().toISOString().split('T')[0];

//       // 4. Write file
//       XLSX.writeFile(workbook, `${cleanFileName}_${dateSuffix}.xlsx`);
//     } catch (error) {
//       console.error('Export failed:', error);
//       alert('Failed to export data.');
//     }
//   };

//   if (selectedDelivery) {
//     return (
//       <DeliveryView campaignId={programId} deliveryData={selectedDelivery} onBack={() => setSelectedDelivery(null)} />
//     );
//   }

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
//       <div className="overflow-x-auto">
//         <table className="w-full text-left border-collapse">
//           <thead className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
//             <tr>
//               <th className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider">
//                 Uploads
//               </th>
//               <th className="px-4 py-4 text-center"></th>
//               <th className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider text-center">
//                 Submitted
//               </th>
//               <th className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider text-center">
//                 Accepted
//               </th>
//               <th className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider text-center">
//                 Errors
//               </th>
//               <th className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider text-center">
//                 Rejections
//               </th>
//               <th className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider text-right">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
//             {data?.map((u) => (
//               <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
//                 <td className="px-4 py-4">
//                   <div className="flex flex-col">
//                     <span
//                       className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]"
//                       title={u.fileName}
//                     >
//                       {u.fileName}
//                     </span>
//                     <span className="text-xs text-gray-500 mt-0.5">{u.date}</span>
//                   </div>
//                 </td>
//                 <td className="px-4 py-4 text-center">
//                   <CircleCheckBig size={18} className="text-emerald-500 inline-block" />
//                 </td>
//                 <td className="px-4 py-4 text-center font-medium text-gray-700 dark:text-gray-300">{u.submitted}</td>
//                 <td className="px-4 py-4 text-center font-medium text-emerald-600 dark:text-emerald-400">
//                   {u.accepted}
//                 </td>
//                 <td className="px-4 py-4 text-center font-medium text-amber-600 dark:text-amber-400">{u.errors}</td>
//                 <td className="px-4 py-4 text-center font-medium text-red-600 dark:text-red-400">{u.rejections}</td>
//                 <td className="px-4 py-4 text-right">
//                   <div className="flex justify-end gap-2">
//                     <button
//                       onClick={() => setSelectedDelivery(u)}
//                       className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
//                       title="View Details"
//                     >
//                       <Eye size={18} />
//                     </button>
//                     <button
//                       onClick={() => handleExport(u)}
//                       className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
//                       title="Export to Excel"
//                     >
//                       <Download size={18} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { CircleCheckBig, Download, Eye, ArrowLeft } from 'lucide-react';
import { FormatDate } from '../../../../components/common/FormatDate';

export const DeliveryView = ({ programId, deliveryData, onBack }) => {
  let tableData = [];
  try {
    tableData = typeof deliveryData?.data === 'string' ? JSON.parse(deliveryData.data) : deliveryData?.data || [];
  } catch (e) {
    console.error('Invalid JSON in deliveryData.data', e);
  }

  const columns = Array.isArray(tableData) && tableData.length > 0 ? Object.keys(tableData[0]) : [];

  if (!deliveryData) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 sticky top-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Details</h2>
        <span className="text-sm text-gray-400 dark:text-gray-500">Campaign #{programId}</span>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{deliveryData.fileName}</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 rounded-lg border border-gray-200 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-800 shadow-sm mb-6">
          <div>
            <p className="text-xs text-gray-500 uppercase">Submitted</p>
            <p className="font-semibold">{deliveryData.submitted}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Accepted</p>
            <p className="font-semibold text-emerald-600">{deliveryData.accepted}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Errors</p>
            <p className="font-semibold text-amber-600">{deliveryData.errors}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Rejections</p>
            <p className="font-semibold text-red-600">{deliveryData.rejections}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Date</p>
            {/* 2. Fixed Component Usage */}
            <FormatDate date={deliveryData.date} />
          </div>
        </div>

        {/* Table view */}
        {Array.isArray(tableData) && tableData.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 font-semibold whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {columns.map((col) => (
                      <td
                        key={`${idx}-${col}`}
                        className="px-4 py-2 text-gray-800 dark:text-gray-200 max-w-xs truncate"
                      >
                        {typeof row[col] === 'object' ? JSON.stringify(row[col]) : (row[col] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <p className="text-gray-500">No valid table data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const UploadTable = ({ data, programId }) => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const handleExport = (upload) => {
    try {
      let exportData = [];
      if (upload.data) {
        exportData = typeof upload.data === 'string' ? JSON.parse(upload.data) : upload.data;
      } else {
        exportData = [
          {
            FileName: upload.fileName,
            Date: upload.date,
            Submitted: upload.submitted,
            Accepted: upload.accepted,
            Errors: upload.errors,
            Rejections: upload.rejections,
          },
        ];
      }

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Upload Details');

      const cleanFileName = upload.fileName?.split('.')[0] || 'export';
      const dateSuffix = new Date().toISOString().split('T')[0];

      XLSX.writeFile(workbook, `${cleanFileName}_${dateSuffix}.xlsx`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data.');
    }
  };

  if (selectedDelivery) {
    return (
      <DeliveryView
        programId={programId}  
        deliveryData={selectedDelivery}
        onBack={() => setSelectedDelivery(null)}
      />
    );
  }




  console.log(data,"data UploadTable")

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-4 py-4 font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider">
                Uploads
              </th>
              <th className="px-4 py-4 text-center">Status</th>
              <th className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase">
                Submitted
              </th>
              <th className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase">
                Accepted
              </th>
              <th className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase">
                Errors
              </th>
              <th className="px-4 py-4 text-center font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase">
                Rejections
              </th>
              <th className="px-4 py-4 text-right font-semibold text-gray-700 dark:text-gray-200 text-xs uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data?.map((u) => (
              <tr key={u.id || u.fileName} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-50" title={u.fileName}>
                      {u.fileName}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5">{u.date}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <CircleCheckBig size={18} className="text-emerald-500 inline-block" />
                </td>
                <td className="px-4 py-4 text-center font-medium text-gray-700 dark:text-gray-300">{u.submitted}</td>
                <td className="px-4 py-4 text-center font-medium text-emerald-600 dark:text-emerald-400">
                  {u.accepted}
                </td>
                <td className="px-4 py-4 text-center font-medium text-amber-600 dark:text-amber-400">{u.errors}</td>
                <td className="px-4 py-4 text-center font-medium text-red-600 dark:text-red-400">{u.rejections}</td>
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setSelectedDelivery(u)}
                      className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleExport(u)}
                      className="p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                      title="Export to Excel"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
