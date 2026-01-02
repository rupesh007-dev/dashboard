// import { useState, useContext, useEffect } from "react";
// import { Upload, AlertCircle, CheckCircle, XCircle } from "lucide-react";
// import { SocketContext } from "../../../../../../context/SocketContext";

// const UploadSection2 = ({
//   onUpload,
//   onHistoryUpdate,
//   tabName,
//   pacingId,
//   user,
//   isUploading,
//   setIsUploading,
//   setHasUploaded,
// }) => {
//   const [uploadFile, setUploadFile] = useState(null);
//   const [error, setError] = useState("");
//   const [progressEvents, setProgressEvents] = useState([]);
//   const [finalResults, setFinalResults] = useState({});
//   const [expandedSteps, setExpandedSteps] = useState({});

//   const socket = useContext(SocketContext);

//   useEffect(() => {
//     const handleProgress = (data) => {
//       setProgressEvents((prev) => [
//         ...prev.filter((e) => e.step !== data.step),
//         data,
//       ]);
//       if (data.result) {
//         setFinalResults((prev) => ({ ...prev, [data.step]: data.result }));
//         const newUpload = {
//           id: Date.now(),
//           pacingId,
//           uploadedBy: user.userId,
//           filename: uploadFile.name,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//           results: data.result,
//           uploader: { id: user.userId, name: user.name || "User" },
//         };
//         onUpload(newUpload);
//         onHistoryUpdate((prev) => [newUpload, ...prev]);
//         setHasUploaded(true);
//       }
//     };

//     socket.on("validationProgress", handleProgress);
//     return () => socket.off("validationProgress", handleProgress);
//   }, [
//     socket,
//     onUpload,
//     onHistoryUpdate,
//     pacingId,
//     user,
//     uploadFile,
//     setHasUploaded,
//   ]);

//   const selectUrl = () => {
//     const baseUrl = `${import.meta.env.VITE_BASE_URL}/bulk-upload/`;
//     const uploadUrls = {
//       phase1: "unassigned-template",
//       transfer: "assign-template",
//       phase2: "assigned-template",
//     };
//     return baseUrl + (uploadUrls[tabName] || "unassigned-template");
//   };

//   const uploadToApi = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("pacingId", pacingId);
//     formData.append("uploadedBy", user.userId);

//     try {
//       setIsUploading(true);
//       setError("");
//       setProgressEvents([]);
//       setFinalResults({});

//       const url = selectUrl();
//       const response = await fetch(url, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${user.token}` },
//         body: formData,
//       });

//       const result = await response.json();
//       if (!response.ok) {
//         setError(result.message || "Upload failed");
//         setHasUploaded(false);
//       }
//     } catch (e) {
//       setError("Upload error: " + e.message);
//       setHasUploaded(false);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleUpload = () => {
//     if (uploadFile) uploadToApi(uploadFile);
//     else setError("Please select a file first");
//   };

//   const toggleStep = (step) =>
//     setExpandedSteps((prev) => ({ ...prev, [step]: !prev[step] }));

//   return (
//     <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg">
//       <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
//         Upload New File
//       </h3>

//       <div className="flex items-center gap-4 mb-6">
//         <label className="flex-1 block">
//           <input
//             type="file"
//             accept=".csv"
//             onChange={(e) => setUploadFile(e.target.files[0])}
//             className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
//               file:rounded-lg file:border-0 file:text-sm file:font-semibold
//               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
//               dark:file:bg-blue-900/30 dark:file:text-blue-300"
//           />
//         </label>
//         <button
//           onClick={handleUpload}
//           disabled={isUploading || !uploadFile}
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
//         >
//           <Upload className="w-4 h-4 mr-2" />
//           {isUploading ? "Uploading..." : "Upload"}
//         </button>
//       </div>

//       {uploadFile && (
//         <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//           Selected file: <strong>{uploadFile.name}</strong>
//         </p>
//       )}

//       {error && (
//         <div className="flex items-center text-red-600 dark:text-red-400 text-sm mb-4">
//           <AlertCircle className="w-4 h-4 mr-2" />
//           {error}
//         </div>
//       )}

//       {progressEvents.length > 0 && (
//         <div className="space-y-4 mt-4">
//           {progressEvents.map((event, idx) => {
//             const isCompleted =
//               event.percentage === 100 || event.step === "completed";
//             return (
//               <div
//                 key={idx}
//                 className="p-3 border rounded-lg bg-gray-100 dark:bg-gray-700"
//               >
//                 <div
//                   className="flex justify-between items-center mb-2 cursor-pointer"
//                   onClick={() => toggleStep(event.step)}
//                 >
//                   <div className="flex items-center gap-2">
//                     {isCompleted ? (
//                       <CheckCircle className="w-5 h-5 text-green-500" />
//                     ) : event.step === "failed" ? (
//                       <XCircle className="w-5 h-5 text-red-500" />
//                     ) : (
//                       <div className="w-5 h-5 rounded-full border-2 border-blue-500 animate-pulse" />
//                     )}
//                     <p className="font-medium text-gray-800 dark:text-gray-100">
//                       {event.step}
//                     </p>
//                   </div>
//                   <span className="text-sm text-gray-600 dark:text-gray-300">
//                     {event.percentage}%
//                   </span>
//                 </div>
//                 <div className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-full">
//                   <div
//                     className={`h-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-blue-500"}`}
//                     style={{ width: `${event.percentage}%` }}
//                   ></div>
//                 </div>

//                 {expandedSteps[event.step] && event.result && (
//                   <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md text-xs text-gray-700 dark:text-gray-300">
//                     <pre>{JSON.stringify(event.result, null, 2)}</pre>
//                   </div>
//                 )}

//                 <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
//                   {event.message}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadSection2;
