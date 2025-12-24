// // import { useEffect, useState } from "react";
// // import { X, Download, AlertCircle, CheckCircle } from "lucide-react";

// // const LeadResultUploadModal = ({ onClose, tabName, pacingId, user }) => {
// //   const [activeTab, setActiveTab] = useState("current");
// //   const [uploadFile, setUploadFile] = useState(null);
// //   const [successCount, setSuccessCount] = useState(0);
// //   const [errorRows, setErrorRows] = useState([]);
// //   const [uploadedRows, setUploadedRows] = useState([]);
// //   const [currentUpload, setCurrentUpload] = useState([]);

// //   useEffect(() => {
// //     if (!pacingId) return;

// //     const fetchData = async () => {
// //       try {
// //         const response = await fetch(
// //           `${import.meta.env.VITE_BASE_URL}/leadUploads/pacing/${pacingId}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${user.token}`,
// //             },
// //           }
// //         );

// //         if (!response.ok)
// //           throw new Error(`HTTP error! Status: ${response.status}`);

// //         const res = await response.json();
// //         setCurrentUpload(res.uploads || []);
// //       } catch (e) {
// //         console.error("Fetch error:", e);
// //       }
// //     };

// //     fetchData();
// //   }, [pacingId, user.token]);

// //   const uploadHistory = [
// //     {
// //       id: 101,
// //       pacingId: 501,
// //       uploader: "Admin",
// //       filename: "leads_batch_01.csv",
// //       created_at: "2025-08-19 10:15",
// //       updated_at: "2025-08-19 10:17",
// //       results: {
// //         validRowsCount: 120,
// //         errorRowsCount: 5,
// //         errors: [
// //           {
// //             index: 3,
// //             firstName: "Charlie",
// //             lastName: "Brown",
// //             email: "invalid-email",
// //             company: "ACME Corp",
// //             jobtitle: "Analyst",
// //             country: "US",
// //             _errors: {
// //               email: "Invalid email format",
// //             },
// //           },
// //           {
// //             index: 5,
// //             firstName: "Daisy",
// //             lastName: "",
// //             email: "daisy@example.com",
// //             company: "",
// //             jobtitle: "Designer",
// //             country: "UK",
// //             _errors: {
// //               lastName: "Last name required",
// //               company: "Company required",
// //             },
// //           },
// //         ],
// //       },
// //     },
// //     {
// //       id: 102,
// //       pacingId: 502,
// //       uploader: "John",
// //       filename: "leads_batch_02.csv",
// //       created_at: "2025-08-20 09:30",
// //       updated_at: "2025-08-20 09:35",
// //       results: {
// //         validRowsCount: 98,
// //         errorRowsCount: 2,
// //         errors: [
// //           {
// //             index: 7,
// //             firstName: "Ethan",
// //             lastName: "Smith",
// //             email: "ethan@",
// //             company: "Tech Corp",
// //             jobtitle: "Developer",
// //             country: "CA",
// //             _errors: {
// //               email: "Invalid email format",
// //             },
// //           },
// //         ],
// //       },
// //     },
// //   ];

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     setUploadFile(file);
// //   };

// //   const selectUrl = () => {
// //     let baseUrl = `${import.meta.env.VITE_BASE_URL}/bulk-upload/`;
// //     let uploadUrl;
// //     if (tabName === "phase1") {
// //       uploadUrl = "unassigned-template";
// //     } else if (tabName == "transfer") {
// //       uploadUrl = "assign-template";
// //     } else if (tabName == "phase2") {
// //       uploadUrl = "assigned-template";
// //     }
// //     return baseUrl + uploadUrl;
// //   };

// //   const uploadToApi = async (file) => {
// //     const formData = new FormData();
// //     formData.append("file", file);
// //     formData.append("pacingId", pacingId);
// //     formData.append("uploadedBy", user.userId);

// //     try {
// //       const url = selectUrl();
// //       const response = await fetch(url, {
// //         method: "POST",
// //         headers: {
// //           Authorization: `Bearer ${user.token}`,
// //         },
// //         body: formData,
// //       });

// //       const result = await response.json();

// //       // if (!response.ok && result.data && Array.isArray(result.data)) {
// //       //   setUploadedRows(result.data.totalRows);
// //       //   setErrorRows(result.data.errors);
// //       //   setSuccessCount(result.data.validRowsCount);
// //       // } else {
// //       //   setUploadedRows(result.data.totalRows);
// //       //   setErrorRows(result.data.errors);
// //       //   setSuccessCount(result.data.validRowsCount || 0);
// //       // }

// //       setIsModalOpen(true);
// //     } catch (e) {
// //       console.error(e);
// //       // setErrorRows([
// //       //   { index: 0, _errors: { general: ["Unexpected server error."] } },
// //       // ]);
// //       setSuccessCount(0);
// //       setIsModalOpen(true);
// //     }
// //   };

// //   const handleUpload = () => {
// //     if (uploadFile) {
// //       uploadToApi(uploadFile);
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 flex items-center justify-center z-50">
// //       <div
// //         className="absolute inset-0 bg-black bg-opacity-50"
// //         onClick={onClose}
// //       ></div>

// //       <div className="relative bg-white dark:bg-gray-900 rounded-xl   w-full max-w-6xl max-h-[95vh] overflow-hidden z-10">
// //         <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
// //           <div >
// //             <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
// //               Lead Upload Results
// //             </h2>
// //             <p className="text-sm text-gray-500 dark:text-gray-400">
// //               View upload results and history
// //             </p>
// //           </div>

// //           <div>{tabName}</div>
// //           <button
// //             onClick={onClose}
// //             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
// //           >
// //             <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
// //           </button>
// //         </div>

// //         <div className="border-b border-gray-200 dark:border-gray-700">
// //           <div className="flex px-6">
// //             <button
// //               className={`px-4 py-3 font-medium text-sm flex items-center border-b-2 transition-all ${
// //                 activeTab === "current"
// //                   ? "border-blue-500 text-blue-600 dark:text-blue-400"
// //                   : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
// //               }`}
// //               onClick={() => setActiveTab("current")}
// //             >
// //               <CheckCircle className="w-4 h-4 mr-2" />
// //               Upload
// //               <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
// //                 {currentUpload.results.errors.length} errors
// //               </span>
// //             </button>
// //             <button
// //               className={`px-4 py-3 font-medium text-sm flex items-center border-b-2 transition-all ${
// //                 activeTab === "history"
// //                   ? "border-blue-500 text-blue-600 dark:text-blue-400"
// //                   : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
// //               }`}
// //               onClick={() => setActiveTab("history")}
// //             >
// //               <AlertCircle className="w-4 h-4 mr-2" />
// //               Upload History
// //               <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded-full">
// //                 {uploadHistory.length}
// //               </span>
// //             </button>
// //           </div>
// //         </div>

// //         <div
// //           className="overflow-y-auto p-6"
// //           style={{ maxHeight: "calc(90vh - 150px)" }}
// //         >
// //           {activeTab === "current" ? (
// //             <>
// //               <div className="flex justify-between items-center mb-4">
// //                 <div>
// //                   <div className="flex  gap-4">
// //                     <input
// //                       type="file"
// //                       accept=".csv"
// //                       onChange={handleFileChange}
// //                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
// //                     />
// //                     <button
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         handleUpload();
// //                       }}
// //                       className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
// //                     >
// //                       Upload
// //                     </button>
// //                     {uploadFile && (
// //                       <p className="text-sm text-gray-500 dark:text-gray-400">
// //                         Selected file: <strong>{uploadFile.name}</strong>
// //                       </p>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
// //                 <div className="flex justify-between items-start">
// //                   <div className="flex gap-6 items-center">
// //                     <h4 className="font-medium text-gray-900 dark:text-white">
// //                       {currentUpload.filename}
// //                     </h4>
// //                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
// //                       Uploaded at {currentUpload.created_at}
// //                     </p>
// //                   </div>
// //                   <button className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
// //                     <Download className="w-4 h-4 mr-1" />
// //                     Export Error Report
// //                   </button>
// //                 </div>

// //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
// //                   <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
// //                     <p className="text-xs font-medium text-green-800 dark:text-green-200">
// //                       Valid Rows
// //                     </p>
// //                     <p className="text-xl font-bold text-green-900 dark:text-green-100 mt-1">
// //                       {currentUpload.results.validRowsCount}
// //                     </p>
// //                   </div>

// //                   <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
// //                     <p className="text-xs font-medium text-red-800 dark:text-red-200">
// //                       Error Rows
// //                     </p>
// //                     <p className="text-xl font-bold text-red-900 dark:text-red-100 mt-1">
// //                       {currentUpload.results.errorRowsCount}
// //                     </p>
// //                   </div>

// //                   <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
// //                     <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
// //                       Success Rate
// //                     </p>
// //                     <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
// //                       {Math.round(
// //                         (currentUpload.results.validRowsCount /
// //                           (currentUpload.results.validRowsCount +
// //                             currentUpload.results.errorRowsCount)) *
// //                           100
// //                       )}
// //                       %
// //                     </p>
// //                   </div>
// //                 </div>

// //                 {currentUpload.results.errors.length > 0 && (
// //                   <div className="mt-4">
// //                     <div className="flex items-center text-sm font-medium text-red-700 dark:text-red-300 mb-2">
// //                       <AlertCircle className="w-4 h-4 mr-1" />
// //                       Error Leads ({currentUpload.results.errors.length})
// //                     </div>

// //                     <div className="overflow-x-auto border border-red-200 dark:border-red-800 rounded-lg">
// //                       <table className="w-full text-sm">
// //                         <thead className="bg-red-50 dark:bg-red-900/20 text-left">
// //                           <tr>
// //                             <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                               Row
// //                             </th>
// //                             <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                               Name
// //                             </th>
// //                             <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                               Email
// //                             </th>
// //                             <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                               Company
// //                             </th>
// //                             <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                               Job Title
// //                             </th>
// //                             <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                               Errors
// //                             </th>
// //                           </tr>
// //                         </thead>
// //                         <tbody className="divide-y divide-red-100 dark:divide-red-800">
// //                           {currentUpload.results.errors.map(
// //                             (errorLead, index) => (
// //                               <tr
// //                                 key={index}
// //                                 className="hover:bg-red-50 dark:hover:bg-red-900/10"
// //                               >
// //                                 <td className="p-2 text-red-700 dark:text-red-300">
// //                                   {errorLead.index}
// //                                 </td>
// //                                 <td className="p-2">
// //                                   <div className="flex flex-col">
// //                                     <span className="font-medium text-red-800 dark:text-red-200">
// //                                       {errorLead.firstName} {errorLead.lastName}
// //                                     </span>
// //                                   </div>
// //                                 </td>
// //                                 <td className="p-2 text-red-700 dark:text-red-300">
// //                                   {errorLead.email}
// //                                 </td>
// //                                 <td className="p-2 text-red-700 dark:text-red-300">
// //                                   {errorLead.company}
// //                                 </td>
// //                                 <td className="p-2 text-red-700 dark:text-red-300">
// //                                   {errorLead.jobtitle}
// //                                 </td>
// //                                 <td className="p-2">
// //                                   <ul className="space-y-1">
// //                                     {Object.entries(errorLead._errors).map(
// //                                       ([field, errorMsg]) => (
// //                                         <li
// //                                           key={field}
// //                                           className="text-xs text-red-600 dark:text-red-400"
// //                                         >
// //                                           • {field}: {errorMsg}
// //                                         </li>
// //                                       )
// //                                     )}
// //                                   </ul>
// //                                 </td>
// //                               </tr>
// //                             )
// //                           )}
// //                         </tbody>
// //                       </table>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </>
// //           ) : (
// //             <>
// //               <div className="flex justify-between items-center mb-4">
// //                 <h3 className="text-lg font-medium text-gray-800 dark:text-white">
// //                   Upload History
// //                 </h3>
// //               </div>

// //               <div className="space-y-4">
// //                 {uploadHistory.map((history) => (
// //                   <div
// //                     key={history.id}
// //                     className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
// //                   >
// //                     <div className="flex justify-between items-start">
// //                       <div>
// //                         <h4 className="font-medium text-gray-900 dark:text-white">
// //                           {history.filename}
// //                         </h4>
// //                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
// //                           Uploaded by {history.uploader} • {history.created_at}
// //                         </p>
// //                       </div>
// //                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
// //                         Pacing #{history.pacingId}
// //                       </span>
// //                     </div>

// //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
// //                       <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
// //                         <p className="text-xs font-medium text-green-800 dark:text-green-200">
// //                           Valid Rows
// //                         </p>
// //                         <p className="text-xl font-bold text-green-900 dark:text-green-100 mt-1">
// //                           {history.results.validRowsCount}
// //                         </p>
// //                       </div>

// //                       <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
// //                         <p className="text-xs font-medium text-red-800 dark:text-red-200">
// //                           Error Rows
// //                         </p>
// //                         <p className="text-xl font-bold text-red-900 dark:text-red-100 mt-1">
// //                           {history.results.errorRowsCount}
// //                         </p>
// //                       </div>

// //                       <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
// //                         <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
// //                           Success Rate
// //                         </p>
// //                         <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
// //                           {Math.round(
// //                             (history.results.validRowsCount /
// //                               (history.results.validRowsCount +
// //                                 history.results.errorRowsCount)) *
// //                               100
// //                           )}
// //                           %
// //                         </p>
// //                       </div>
// //                     </div>

// //                     {history.results.errors.length > 0 && (
// //                       <div className="mt-4">
// //                         <div className="flex items-center text-sm font-medium text-red-700 dark:text-red-300 mb-2">
// //                           <AlertCircle className="w-4 h-4 mr-1" />
// //                           Error Leads ({history.results.errors.length})
// //                         </div>

// //                         <div className="overflow-x-auto border border-red-200 dark:border-red-800 rounded-lg">
// //                           <table className="w-full text-sm">
// //                             <thead className="bg-red-50 dark:bg-red-900/20 text-left">
// //                               <tr>
// //                                 <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                                   Row
// //                                 </th>
// //                                 <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                                   Name
// //                                 </th>
// //                                 <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                                   Email
// //                                 </th>
// //                                 <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                                   Company
// //                                 </th>
// //                                 <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                                   Job Title
// //                                 </th>
// //                                 <th className="p-2 font-medium text-red-800 dark:text-red-200">
// //                                   Errors
// //                                 </th>
// //                               </tr>
// //                             </thead>
// //                             <tbody className="divide-y divide-red-100 dark:divide-red-800">
// //                               {history.results.errors.map(
// //                                 (errorLead, index) => (
// //                                   <tr
// //                                     key={index}
// //                                     className="hover:bg-red-50 dark:hover:bg-red-900/10"
// //                                   >
// //                                     <td className="p-2 text-red-700 dark:text-red-300">
// //                                       {errorLead.index}
// //                                     </td>
// //                                     <td className="p-2">
// //                                       <div className="flex flex-col">
// //                                         <span className="font-medium text-red-800 dark:text-red-200">
// //                                           {errorLead.firstName}
// //                                           {errorLead.lastName}
// //                                         </span>
// //                                       </div>
// //                                     </td>
// //                                     <td className="p-2 text-red-700 dark:text-red-300">
// //                                       {errorLead.email}
// //                                     </td>
// //                                     <td className="p-2 text-red-700 dark:text-red-300">
// //                                       {errorLead.company}
// //                                     </td>
// //                                     <td className="p-2 text-red-700 dark:text-red-300">
// //                                       {errorLead.jobtitle}
// //                                     </td>
// //                                     <td className="p-2">
// //                                       <ul className="space-y-1">
// //                                         {Object.entries(errorLead._errors).map(
// //                                           ([field, errorMsg]) => (
// //                                             <li
// //                                               key={field}
// //                                               className="text-xs text-red-600 dark:text-red-400"
// //                                             >
// //                                               • {field}: {errorMsg}
// //                                             </li>
// //                                           )
// //                                         )}
// //                                       </ul>
// //                                     </td>
// //                                   </tr>
// //                                 )
// //                               )}
// //                             </tbody>
// //                           </table>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LeadResultUploadModal;
import { useEffect, useState } from 'react';
import { X, Download, AlertCircle, CheckCircle } from 'lucide-react';

const LeadResultUploadModal = ({ onClose, tabName, pacingId, user }) => {
  const [activeTab, setActiveTab] = useState('current');
  const [uploadFile, setUploadFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUpload, setCurrentUpload] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);

  useEffect(() => {
    if (!pacingId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/leadUploads/pacing/${pacingId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const res = await response.json();
        const uploadsWithParsedResults = res.uploads.map((upload) => ({
          ...upload,
          results: typeof upload.results === 'string' ? JSON.parse(upload.results) : upload.results,
        }));

        // Set the most recent upload as current
        if (uploadsWithParsedResults.length > 0) {
          setCurrentUpload(uploadsWithParsedResults[0]);
        }

        // Set all uploads as history
        setUploadHistory(uploadsWithParsedResults);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    };

    fetchData();
  }, [pacingId, user.token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadFile(file);
  };

  const selectUrl = () => {
    let baseUrl = `${import.meta.env.VITE_BASE_URL}/bulk-upload/`;
    let uploadUrl;
    if (tabName === 'phase1') {
      uploadUrl = 'unassigned-template';
    } else if (tabName == 'transfer') {
      uploadUrl = 'assign-template';
    } else if (tabName == 'phase2') {
      uploadUrl = 'assigned-template';
    }
    return baseUrl + uploadUrl;
  };

  const uploadToApi = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pacingId', pacingId);
    formData.append('uploadedBy', user.userId);

    try {
      setIsUploading(true);
      const url = selectUrl();
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const parsedResults = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;

        setHasUploaded(true);
        setCurrentUpload({
          id: Date.now(),
          pacingId: pacingId,
          uploadedBy: user.userId,
          filename: file.name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          results: parsedResults,
          uploader: {
            id: user.userId,
            name: user.name || 'User',
          },
        });

        setUploadHistory((prev) => [
          {
            id: Date.now(),
            pacingId: pacingId,
            uploadedBy: user.userId,
            filename: file.name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            results: parsedResults,
            uploader: {
              id: user.userId,
              name: user.name || 'User',
            },
          },
          ...prev,
        ]);
      } else {
        console.error('Upload failed:', result);
        alert('Upload failed: ' + (result.message || 'Unknown error'));
      }
    } catch (e) {
      console.error(e);
      alert('Upload error: ' + e.message);
    } finally {
      setIsUploading(false);
      setIsModalOpen(true);
    }
  };

  const handleUpload = () => {
    if (uploadFile) {
      uploadToApi(uploadFile);
    } else {
      alert('Please select a file first');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const exportToCSV = () => {
    if (!currentUpload || !currentUpload.results?.errors?.length) {
      alert('No errors available to export.');
      return;
    }

    const errors = currentUpload.results.errors;

    // Define headers
    const headers = ['Row', 'First Name', 'Last Name', 'Email', 'Company', 'Job Title', 'Errors'];

    // Map data
    const rows = errors.map((err) => {
      const errorMessages = Object.entries(err._errors)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
        .join(' | ');

      return [
        err.index,
        err.firstName || '',
        err.lastName || '',
        err.email || '',
        err.company || '',
        err.jobTitle || '',
        errorMessages,
      ];
    });

    // Convert to CSV string
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentUpload.filename}_error_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-gray-900 rounded-xl   w-full max-w-6xl max-h-[95vh] overflow-hidden z-10">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Lead Upload Results</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">View upload results and history</p>
          </div>

          <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
            {tabName}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex px-6">
            <button
              className={`px-4 py-3 font-medium text-sm flex items-center border-b-2 transition-all ${
                activeTab === 'current'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('current')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Upload
              <span className="ml-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                {(hasUploaded && currentUpload?.results?.errors?.length) || 0}
                errors
              </span>
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm flex items-center border-b-2 transition-all ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('history')}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Upload History
              <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-0.5 rounded-full">
                {uploadHistory.length}
              </span>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 150px)' }}>
          {activeTab === 'current' ? (
            <>
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !uploadFile}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
                {uploadFile && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selected file: <strong>{uploadFile.name}</strong>
                  </p>
                )}
              </div>
              {hasUploaded && currentUpload && (
                // {currentUpload && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-6 items-center">
                      <h4 className="font-medium text-gray-900 dark:text-white">{currentUpload.filename}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Uploaded at {formatDate(currentUpload.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={exportToCSV}
                      className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Export Error Report
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                      <p className="text-xs font-medium text-green-800 dark:text-green-200">Valid Rows</p>
                      <p className="text-xl font-bold text-green-900 dark:text-green-100 mt-1">
                        {currentUpload.results.validRowsCount}
                      </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                      <p className="text-xs font-medium text-red-800 dark:text-red-200">Error Rows</p>
                      <p className="text-xl font-bold text-red-900 dark:text-red-100 mt-1">
                        {currentUpload.results.errorRowsCount}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200">Success Rate</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                        {Math.round(
                          (currentUpload.results.validRowsCount /
                            (currentUpload.results.validRowsCount + currentUpload.results.errorRowsCount)) *
                            100
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  {currentUpload.results.errors.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Error Leads ({currentUpload.results.errors.length})
                      </div>

                      <div className="overflow-x-auto border border-red-200 dark:border-red-800 rounded-lg">
                        <table className="w-full text-sm">
                          <thead className="bg-red-50 dark:bg-red-900/20 text-left">
                            <tr>
                              <th className="p-2 font-medium text-red-800 dark:text-red-200">Row</th>
                              <th className="p-2 font-medium text-red-800 dark:text-red-200">Name</th>
                              <th className="p-2 font-medium text-red-800 dark:text-red-200">Email</th>
                              <th className="p-2 font-medium text-red-800 dark:text-red-200">Company</th>
                              <th className="p-2 font-medium text-red-800 dark:text-red-200">Job Title</th>
                              <th className="p-2 font-medium text-red-800 dark:text-red-200">Errors</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-red-100 dark:divide-red-800">
                            {currentUpload.results.errors.map((errorLead, index) => (
                              <tr key={index} className="hover:bg-red-50 dark:hover:bg-red-900/10">
                                <td className="p-2 text-red-700 dark:text-red-300">{errorLead.index}</td>
                                <td className="p-2">
                                  <div className="flex flex-col">
                                    <span className="font-medium text-red-800 dark:text-red-200">
                                      {errorLead.firstName}
                                      {errorLead.lastName}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-2 text-red-700 dark:text-red-300">{errorLead.email}</td>
                                <td className="p-2 text-red-700 dark:text-red-300">{errorLead.company}</td>
                                <td className="p-2 text-red-700 dark:text-red-300">{errorLead.jobTitle}</td>
                                <td className="p-2">
                                  <ul className="space-y-1">
                                    {Object.entries(errorLead._errors).map(([field, errors]) => (
                                      <li key={field} className="text-xs text-red-600 dark:text-red-400">
                                        • {field}:{Array.isArray(errors) ? errors.join(', ') : errors}
                                      </li>
                                    ))}
                                  </ul>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Upload History</h3>
              </div>

              <div className="space-y-4">
                {/* {Object.values(uploadHistory).map((history) => ( */}
                {/* {uploadHistory.length > 0 && (.map((history) => ( */}
                {uploadHistory.length > 0 &&
                  uploadHistory.map((history) => (
                    <div key={history.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{history.filename}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Uploaded by {history.uploader?.name} •{formatDate(history.created_at)}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                          Pacing #{history.pacingId}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                          <p className="text-xs font-medium text-green-800 dark:text-green-200">Valid Rows</p>
                          <p className="text-xl font-bold text-green-900 dark:text-green-100 mt-1">
                            {history.results.validRowsCount}
                          </p>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                          <p className="text-xs font-medium text-red-800 dark:text-red-200">Error Rows</p>
                          <p className="text-xl font-bold text-red-900 dark:text-red-100 mt-1">
                            {history.results.errorRowsCount}
                          </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-800 dark:text-gray-200">Success Rate</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                            {Math.round(
                              (history.results.validRowsCount /
                                (history.results.validRowsCount + history.results.errorRowsCount)) *
                                100
                            )}
                            %
                          </p>
                        </div>
                      </div>

                      {history.results.errors.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Error Leads ({history.results.errors.length})
                          </div>

                          <div className="overflow-x-auto border border-red-200 dark:border-red-800 rounded-lg">
                            <table className="w-full text-sm">
                              <thead className="bg-red-50 dark:bg-red-900/20 text-left">
                                <tr>
                                  <th className="p-2 font-medium text-red-800 dark:text-red-200">Row</th>
                                  <th className="p-2 font-medium text-red-800 dark:text-red-200">Name</th>
                                  <th className="p-2 font-medium text-red-800 dark:text-red-200">Email</th>
                                  <th className="p-2 font-medium text-red-800 dark:text-red-200">Company</th>
                                  <th className="p-2 font-medium text-red-800 dark:text-red-200">Job Title</th>
                                  <th className="p-2 font-medium text-red-800 dark:text-red-200">Errors</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-red-100 dark:divide-red-800">
                                {history.results.errors.map((errorLead, index) => (
                                  <tr key={index} className="hover:bg-red-50 dark:hover:bg-red-900/10">
                                    <td className="p-2 text-red-700 dark:text-red-300">{errorLead.index}</td>
                                    <td className="p-2">
                                      <div className="flex flex-col">
                                        <span className="font-medium text-red-800 dark:text-red-200">
                                          {errorLead.firstName}
                                          {errorLead.lastName}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="p-2 text-red-700 dark:text-red-300">{errorLead.email}</td>
                                    <td className="p-2 text-red-700 dark:text-red-300">{errorLead.company}</td>
                                    <td className="p-2 text-red-700 dark:text-red-300">{errorLead.jobTitle}</td>
                                    <td className="p-2">
                                      <ul className="space-y-1">
                                        {Object.entries(errorLead._errors).map(([field, errors]) => (
                                          <li key={field} className="text-xs text-red-600 dark:text-red-400">
                                            • {field}:{Array.isArray(errors) ? errors.join(', ') : errors}
                                          </li>
                                        ))}
                                      </ul>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadResultUploadModal;
