// import { useState, useRef, useEffect, useCallback } from 'react';
// import ReactQuill from 'react-quill-new';
// import 'react-quill-new/dist/quill.snow.css';
// import Select from 'react-select';
// import { toast } from 'react-hot-toast';
// import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
// import 'jspreadsheet-ce/dist/jspreadsheet.css';
// import 'jsuites/dist/jsuites.css';
// import { useSelector } from 'react-redux';
// import { useDropboxUpload } from '../../../hooks/useDropboxUpload';

// const dayOptions = [
//   { value: 'Monday', label: 'Monday' },
//   { value: 'Tuesday', label: 'Tuesday' },
//   { value: 'Wednesday', label: 'Wednesday' },
//   { value: 'Thursday', label: 'Thursday' },
//   { value: 'Friday', label: 'Friday' },
//   { value: 'Saturday', label: 'Saturday' },
//   { value: 'Sunday', label: 'Sunday' },
//   { value: 'FrontLoad', label: 'FrontLoad' },
// ];

// const clientOptions = [
//   { value: 'PH', label: 'PH' },
//   { value: 'LPM', label: 'LPM' },
// ];

// const formatFileSize = (bytes) => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// };

// const getFileIcon = (fileType) => {
//   if (fileType.includes('image')) return '🖼️';
//   if (fileType.includes('pdf')) return '📄';
//   if (fileType.includes('word') || fileType.includes('document')) return '📝';
//   if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
//   if (fileType.includes('zip') || fileType.includes('compressed')) return '📦';
//   return '📎';
// };

// const Content = ({ setContent }) => {
//   const spreadsheet = useRef(null);
//   const [instance, setInstance] = useState(null);
//   const [contentSaveStatus, setContentSaveStatus] = useState(false);
//   const initialData = [
//     ['TITLE', 'TYPE', 'APPROVEDATE', 'OPTINTYPE', 'CATEGORY'],
//   ];

//   const convertSheetToContentJSON = useCallback((data) => {
//     if (!data || data.length < 2) return [];

//     const rows = data.map((row) => ({
//       TITLE: row[0] || '',
//       TYPE: row[1] || '',
//       APPROVEDATE: row[2] || '',
//       OPTINTYPE: row[3] || '',
//       CATEGORY: row[4] || '',
//     }));

//     rows.shift();

//     const grouped = {};
//     rows.forEach((row) => {
//       const categoryKey = row.CATEGORY.trim();
//       if (!categoryKey) return;

//       if (!grouped[categoryKey]) {
//         grouped[categoryKey] = [];
//       }

//       grouped[categoryKey].push({
//         id: Date.now() + Math.floor(Math.random() * 100000),
//         title: row.TITLE,
//         type: row.TYPE,
//         approveDate: row.APPROVEDATE,
//         optinType: row.OPTINTYPE,
//       });
//     });

//     return Object.keys(grouped).map((category) => ({
//       categoryName: category,
//       content: grouped[category],
//     }));
//   }, []);

//   const updateContent = useCallback(
//     (currentInstance) => {
//       if (!currentInstance) return;
//       const activeSheetIndex = currentInstance.getWorksheetActive();
//       const sheet = currentInstance.worksheets[activeSheetIndex];
//       const data = sheet.getData();
//       const json = convertSheetToContentJSON(data);
//       setContent(json);
//       setContentSaveStatus(true);
//       toast.success('Spreadsheet content staged for submission');
//     },
//     [convertSheetToContentJSON, setContent]
//   );

//   return (
//     <div className="mt-4 border rounded-xl bg-gray-50 p-4">
//       <h3 className="font-semibold text-lg mb-3">Content Spreadsheet</h3>
//       <Spreadsheet
//         ref={spreadsheet}
//         tabs={false}
//         onload={(jspreadsheetInstance) => {
//           setInstance(jspreadsheetInstance);
//         }}
//       >
//         <Worksheet
//           title="Content Input"
//           minDimensions={[6, 6]}
//           data={initialData}
//           columnHeaders={['TITLE', 'TYPE', 'APPROVEDATE', 'OPTINTYPE', 'CATEGORY']}
//         />
//       </Spreadsheet>

//       {contentSaveStatus ? (
//         <p className="text-sm text-green-600 mt-2">Content Status: Saved</p>
//       ) : (
//         <p className="text-sm text-red-600 mt-2">Content Status: Not Saved</p>
//       )}

//       <button
//         type="button"
//         className="mt-4 rounded bg-green-600 text-white px-4 py-2 hover:bg-green-700 text-sm font-medium transition"
//         onClick={() => updateContent(instance)}
//       >
//         Save Content Data
//       </button>
//       <p className="text-xs text-gray-500 mt-2">Click save before submitting the campaign.</p>
//     </div>
//   );
// };

// const FileUploader = ({ selectedFiles, onFilesChange, uploadProgress, isUploading }) => {
//   const fileInputRef = useRef(null);

//   const handleFileSelect = (files) => {
//     const newFiles = Array.from(files).map((file) => ({
//       file,
//       id: Date.now() + Math.random(),
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       status: 'pending',
//     }));
//     onFilesChange([...selectedFiles, ...newFiles]);
//   };

//   const handleFileDrop = (e) => {
//     e.preventDefault();
//     if (!isUploading) handleFileSelect(e.dataTransfer.files);
//   };

//   const removeFile = (fileId) => {
//     onFilesChange(selectedFiles.filter((f) => f.id !== fileId));
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="font-semibold text-lg">Attachments</h3>
//         <span className="text-sm text-gray-500">{selectedFiles.length} file(s) selected</span>
//       </div>

//       <div
//         className={`mt-3 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${!isUploading ? 'hover:border-blue-400 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
//         onDragOver={(e) => e.preventDefault()}
//         onDrop={handleFileDrop}
//         onClick={() => !isUploading && fileInputRef.current?.click()}
//       >
//         <p className="text-gray-600">
//           Drag & drop files here or <span className="text-blue-600 underline font-medium">browse</span>
//         </p>
//         <input
//           ref={fileInputRef}
//           type="file"
//           multiple
//           className="hidden"
//           onChange={(e) => handleFileSelect(e.target.files)}
//           disabled={isUploading}
//         />
//       </div>

//       {selectedFiles.length > 0 && (
//         <div className="mt-4 space-y-2 p-3 border rounded-lg bg-gray-50">
//           <h4 className="font-medium text-sm border-b pb-2">Files Ready:</h4>
//           {selectedFiles.map((file) => (
//             <div key={file.id} className="flex items-center justify-between p-2 rounded bg-white shadow-sm">
//               <div className="flex items-center space-x-3 flex-1 min-w-0">
//                 <span className="text-lg">{getFileIcon(file.type)}</span>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium truncate">{file.name}</p>
//                   <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
//                 </div>
//               </div>
//               {!isUploading && (
//                 <button
//                   type="button"
//                   onClick={() => removeFile(file.id)}
//                   className="text-red-500 hover:text-red-700 ml-2 p-1"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {isUploading && selectedFiles.length > 0 && (
//         <div className="mt-4 p-3 border rounded-lg bg-blue-50">
//           <h4 className="font-semibold text-blue-800 text-sm mb-2">Uploading...</h4>
//           {selectedFiles.map((file) => (
//             <div key={file.id} className="space-y-1 my-1">
//               <div className="flex justify-between text-xs text-blue-700">
//                 <span className="truncate">{file.name}</span>
//                 <span>{uploadProgress[file.name] ? uploadProgress[file.name].toFixed(0) : 0}%</span>
//               </div>
//               <div className="w-full bg-blue-200 rounded-full h-1.5">
//                 <div
//                   className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
//                   style={{ width: `${uploadProgress[file.name] || 0}%` }}
//                 ></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const TaskAssigner = ({ users, selectedUsers, onUserChange, remark, onRemarkChange, level, onLevelChange }) => {
//   return (
//     <div className="mt-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
//       <h3 className="pb-4 text-lg font-semibold">Assign Campaign Task</h3>

//       <div className="flex flex-col gap-2 mb-4">
//         <label htmlFor="user-select" className="font-medium">
//           Select Users
//         </label>
//         <Select
//           id="user-select"
//           options={users}
//           isMulti
//           value={selectedUsers}
//           onChange={onUserChange}
//           placeholder="Select users..."
//           classNamePrefix="react-select"
//         />
//       </div>

//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="flex flex-col flex-1">
//           <label className="font-medium mb-1">Remark</label>
//           <input
//             placeholder="Enter remark"
//             className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2"
//             value={remark}
//             onChange={(e) => onRemarkChange(e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col flex-1">
//           <label className="font-medium mb-1">Level</label>
//           <select
//             className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2"
//             value={level}
//             onChange={(e) => onLevelChange(e.target.value)}
//           >
//             <option value="URGENT">Urgent</option>
//             <option value="VERY_URGENT">Very urgent</option>
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// };

// const initialCampaignState = {
//   id: Date.now(),
//   CampaignName: '',
//   Code: '',
//   LeadGoal: '',
//   Volumes: [{ key: '', value: '' }],
//   Deadline: '',
//   FirstUploadDate: '',
//   WeeklyUploadDay: [],
//   clients: [],
//   ContactsPerCompany: '',
//   Pacing: 'Even',
//   ClientSelect: 1,
//   Content: [{ category: '', titles: [''] }],
//   AdditionalInformation: '',
//   Files: [],
//   DescriptionOfFilesAttached: '',
// };

// const ProgramBuilder = ({ onSuccess }) => {
//   const [campaign, setCampaign] = useState(initialCampaignState);
//   const [content, setContent] = useState([{ category: '', titles: [''] }]);

//   const [users, setUsers] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [taskLevel, setTaskLevel] = useState('URGENT');
//   const [remark, setRemark] = useState('Default');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const user = useSelector((state) => state.user.value);
//   const { uploadFiles, uploadProgress, isUploading } = useDropboxUpload();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users`);
//         const response = await res.json();
//         setUsers(
//           response.map((user) => ({
//             value: user.id,
//             label: user.name || user.email || `User ${user.id}`,
//           }))
//         );
//       } catch (e) {
//         console.error('Failed to fetch users', e);
//       }
//     };
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     setCampaign((prev) => ({ ...prev, Content: content }));
//   }, [content]);

//   useEffect(() => {
//     const savedCampaign = localStorage.getItem('campaignBuilder');

//     if (savedCampaign) {
//       setCampaign(JSON.parse(savedCampaign));
//     }
//   }, []);

//   useEffect(() => {
//     const campaignToSave = JSON.stringify({ ...campaign, Files: [] });
//     localStorage.setItem('campaignBuilder', campaignToSave);
//   }, [campaign]);

//   const handleChange = (field, value) => {
//     setCampaign((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleDynamicFieldChange = (key, index, field, value) => {
//     setCampaign((prev) => {
//       const newArray = [...prev[key]];
//       newArray[index][field] = value;
//       return { ...prev, [key]: newArray };
//     });
//   };

//   const addField = (key) => {
//     if (key === 'Volumes') {
//       setCampaign((prev) => ({
//         ...prev,
//         Volumes: [...prev.Volumes, { key: '', value: '' }],
//       }));
//     }
//   };

//   const removeField = (key, index) => {
//     setCampaign((prev) => ({
//       ...prev,
//       [key]: prev[key].filter((_, i) => i !== index),
//     }));
//   };

//   const createTask = async (campaignId, campaignName) => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           type: 'Campaign',
//           typeId: campaignId,
//           name: campaignName,
//           status: 'Not Started',
//           remark: remark,
//           level: taskLevel,
//         }),
//       });

//       // const data = await res.json();
//       return await res.json();
//     } catch (e) {
//       console.error('Create task failed', e);
//     }
//   };

//   const assignTask = async (taskId, assignedById, users) => {
//     try {
//       await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${taskId}/assign`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ assignedById, users }),
//       });
//     } catch (e) {
//       console.error('Assign task failed', e);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!campaign.CampaignName || !campaign.Code) {
//       toast.error('Please enter Campaign Name and Code before submitting');
//       return;
//     }
//     if (selectedFiles.length === 0) {
//       toast.error('Please select at least one file to upload');
//       return;
//     }

//     setIsSubmitting(true);
//     const toastId = toast.loading('Starting submission...');

//     try {
//       const folderName = `${campaign.CampaignName}_${campaign.Code}`.replace(/[^a-zA-Z0-9_-]/g, '_');
//       const filesToUpload = selectedFiles.map((f) => f.file);
//       const uploadedFiles = await uploadFiles(filesToUpload, folderName);

//       toast.loading('Files uploaded, creating campaign...', { id: toastId });

//       const campaignToSubmit = { ...campaign, Files: uploadedFiles };
//       const campaignRes = await fetch(`${import.meta.env.VITE_BASE_URL}/create-campaign`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(campaignToSubmit),
//       });

//       const campaignResponse = await campaignRes.json();
//       if (!campaignRes.ok) {
//         throw new Error(campaignResponse.message || 'Failed to upload campaign.');
//       }

//       toast.loading('Campaign created, creating task...', { id: toastId });

//       const campaignData = campaignResponse.data;

//       const createTaskResponse = await createTask(campaignData.id, campaignData.name);

//       const newTask = createTaskResponse.data;
//       const assignedUsers = selectedUsers.map((e) => e.value);
//       if (assignedUsers.length > 0 && newTask) {
//         await assignTask(newTask.id, user.userId, assignedUsers);
//       }

//       setSelectedFiles([]);
//       localStorage.removeItem('campaignBuilder');
//       toast.success('Campaign created and tasks successfully processed!', { id: toastId });

//       if (onSuccess) {
//         onSuccess();
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       toast.error(error.message || 'Submission failed. Please try again.', { id: toastId });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="mt-6 border rounded-2xl bg-white p-6">
//       <h2 className="text-xl font-semibold mb-6">Campaign Builder</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <input
//               type="text"
//               placeholder="Campaign Name *"
//               className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
//               value={campaign.CampaignName}
//               onChange={(e) => handleChange('CampaignName', e.target.value)}
//               required
//             />
//           </div>
//           <div>
//             <input
//               type="text"
//               placeholder="Code *"
//               className="border p-2 rounded w-full focus:ring-blue-500 focus:border-blue-500"
//               value={campaign.Code}
//               onChange={(e) => handleChange('Code', e.target.value)}
//               required
//             />
//           </div>
//           <input
//             type="number"
//             placeholder="Lead Goal"
//             className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
//             value={campaign.LeadGoal}
//             onChange={(e) => handleChange('LeadGoal', e.target.value)}
//           />
//           <input
//             type="number"
//             placeholder="Contacts per Company"
//             className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
//             value={campaign.ContactsPerCompany}
//             onChange={(e) => handleChange('ContactsPerCompany', e.target.value)}
//           />

//           <div>
//             <label className="text-sm font-medium block mb-1 text-gray-700">Client</label>
//             <Select
//               isMulti
//               name="clients"
//               options={clientOptions}
//               className="basic-multi-select"
//               classNamePrefix="select"
//               placeholder="Select one or more clients..."
//               value={clientOptions.filter((d) => campaign.clients?.includes(d.value))}
//               onChange={(selected) => handleChange('clients', selected ? selected.map((s) => s.value) : [])}
//             />
//           </div>
//         </div>

//         <hr className="my-6 border-gray-200" />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <label className="text-sm font-medium text-gray-700">
//             Deadline:
//             <input
//               type="date"
//               className="border p-2 rounded w-full mt-1 focus:ring-blue-500 focus:border-blue-500"
//               value={campaign.Deadline}
//               onChange={(e) => handleChange('Deadline', e.target.value)}
//             />
//           </label>
//           <label className="text-sm font-medium text-gray-700">
//             First Upload Date:
//             <input
//               type="date"
//               className="border p-2 rounded w-full mt-1 focus:ring-blue-500 focus:border-blue-500"
//               value={campaign.FirstUploadDate}
//               onChange={(e) => handleChange('FirstUploadDate', e.target.value)}
//             />
//           </label>
//         </div>

//         <div>
//           <label className="text-sm font-medium block mb-1 text-gray-700">Weekly Upload Days</label>
//           <Select
//             isMulti
//             name="weeklyDays"
//             options={dayOptions}
//             className="basic-multi-select"
//             classNamePrefix="select"
//             placeholder="Select one or more days..."
//             value={dayOptions.filter((d) => campaign.WeeklyUploadDay?.includes(d.value))}
//             onChange={(selected) => handleChange('WeeklyUploadDay', selected ? selected.map((s) => s.value) : [])}
//           />
//         </div>

//         <hr className="my-6 border-gray-200" />

//         <div>
//           <div className="flex justify-between items-center mb-3">
//             <h3 className="font-semibold text-lg">Volumes</h3>
//             <button
//               type="button"
//               onClick={() => addField('Volumes')}
//               className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
//             >
//               + Add Volume
//             </button>
//           </div>
//           {campaign.Volumes.map((v, i) => (
//             <div key={i} className="flex gap-2 mt-2 items-center">
//               <input
//                 placeholder="Key (e.g. Japan-AI)"
//                 value={v.key}
//                 className="border p-2 rounded w-1/2 focus:ring-blue-500 focus:border-blue-500"
//                 onChange={(e) => handleDynamicFieldChange('Volumes', i, 'key', e.target.value)}
//               />
//               <input
//                 placeholder="Value"
//                 value={v.value}
//                 className="border p-2 rounded w-1/2 focus:ring-blue-500 focus:border-blue-500"
//                 onChange={(e) => handleDynamicFieldChange('Volumes', i, 'value', e.target.value)}
//               />
//               {campaign.Volumes.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeField('Volumes', i)}
//                   className="text-red-500 hover:text-red-700 transition-colors p-1"
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>

//         <hr className="my-6 border-gray-200" />

//         <Content content={content} setContent={setContent} />

//         <hr className="my-6 border-gray-200" />

//         <div>
//           <h3 className="font-semibold text-lg mb-2">Additional Information</h3>
//           <ReactQuill
//             theme="snow"
//             value={campaign.AdditionalInformation}
//             onChange={(value) => handleChange('AdditionalInformation', value)}
//             className="bg-white rounded"
//             placeholder="Type or paste formatted content for additional context..."
//           />
//         </div>
//         <div>
//           <h3 className="font-semibold text-lg mb-2">Description of Files Attached</h3>
//           <ReactQuill
//             theme="snow"
//             value={campaign.DescriptionOfFilesAttached}
//             onChange={(value) => handleChange('DescriptionOfFilesAttached', value)}
//             className="bg-white rounded"
//             placeholder="Describe the purpose of the files you attached..."
//           />
//         </div>

//         <hr className="my-6 border-gray-200" />

//         <div className="mt-10">
//           <FileUploader
//             selectedFiles={selectedFiles}
//             onFilesChange={setSelectedFiles}
//             uploadProgress={uploadProgress}
//             isUploading={isUploading}
//           />
//         </div>

//         <TaskAssigner
//           users={users}
//           selectedUsers={selectedUsers}
//           onUserChange={setSelectedUsers}
//           remark={remark}
//           onRemarkChange={setRemark}
//           level={taskLevel}
//           onLevelChange={setTaskLevel}
//         />

//         <hr className="my-6 border-gray-200" />

//         <button
//           type="submit"
//           disabled={isSubmitting || isUploading || selectedFiles.length === 0}
//           className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
//         >
//           {isSubmitting || isUploading ? (
//             <span className="flex items-center">
//               <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />

//               {isUploading ? 'Uploading Files...' : 'Processing Campaign...'}
//             </span>
//           ) : (
//             'Create Campaign & Upload Files'
//           )}
//         </button>
//       </form>

//       {/* <div className="mt-8">
//         <h3 className="font-medium mb-2">Live Campaign State JSON Preview</h3>
//         <textarea
//           className="w-full border p-3 rounded font-mono text-sm h-80 bg-gray-50 resize-none"
//           value={JSON.stringify(campaign, null, 2)}
//           readOnly
//         />
//       </div> */}
//     </div>
//   );
// };

// export default ProgramBuilder;
import { useState, useRef, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Select from 'react-select';
import { toast } from 'react-hot-toast';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import { LoaderCircle } from 'lucide-react';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import 'jsuites/dist/jsuites.css';
import { useSelector } from 'react-redux';
import { useDropboxUpload } from '../../../hooks/useDropboxUpload';

const dayOptions = [
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
  { value: 'Sunday', label: 'Sunday' },
  { value: 'FrontLoad', label: 'FrontLoad' },
];

const clientOptions = [
  { value: 'PH', label: 'PH' },
  { value: 'LPM', label: 'LPM' },
];

const getFileIcon = (fileType) => {
  if (fileType.includes('image')) return '🖼️';
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word')) return '📝';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
  return '📎';
};

const Content = ({ setContent }) => {
  const spreadsheet = useRef(null);
  const [instance, setInstance] = useState(null);
  const [contentSaveStatus, setContentSaveStatus] = useState(false);
  const initialData = [['TITLE', 'TYPE', 'APPROVEDATE', 'OPTINTYPE', 'CATEGORY']];

  const convertSheetToContentJSON = useCallback((data) => {
    if (!data || data.length < 2) return [];

    const rows = data.map((row) => ({
      TITLE: row[0] || '',
      TYPE: row[1] || '',
      APPROVEDATE: row[2] || '',
      OPTINTYPE: row[3] || '',
      CATEGORY: row[4] || '',
    }));

    rows.shift();

    const grouped = {};
    rows.forEach((row) => {
      const categoryKey = row.CATEGORY.trim();
      if (!categoryKey) return;

      if (!grouped[categoryKey]) {
        grouped[categoryKey] = [];
      }

      grouped[categoryKey].push({
        id: Date.now() + Math.floor(Math.random() * 100000),
        title: row.TITLE,
        type: row.TYPE,
        approveDate: row.APPROVEDATE,
        optinType: row.OPTINTYPE,
      });
    });

    return Object.keys(grouped).map((category) => ({
      categoryName: category,
      content: grouped[category],
    }));
  }, []);

  const updateContent = useCallback(
    (currentInstance) => {
      if (!currentInstance) return;
      const activeSheetIndex = currentInstance.getWorksheetActive();
      const sheet = currentInstance.worksheets[activeSheetIndex];
      const data = sheet.getData();
      const json = convertSheetToContentJSON(data);
      setContent(json);
      setContentSaveStatus(true);
      toast.success('Spreadsheet content staged for submission');
    },
    [convertSheetToContentJSON, setContent]
  );

  return (
    <div className="mt-4 border rounded-xl bg-gray-50 p-4">
      <h3 className="font-semibold text-lg mb-3">Content Spreadsheet</h3>
      <Spreadsheet
        ref={spreadsheet}
        tabs={false}
        onload={(jspreadsheetInstance) => {
          setInstance(jspreadsheetInstance);
        }}
      >
        <Worksheet
          title="Content Input"
          minDimensions={[6, 6]}
          data={initialData}
          columnHeaders={['TITLE', 'TYPE', 'APPROVEDATE', 'OPTINTYPE', 'CATEGORY']}
        />
      </Spreadsheet>

      {contentSaveStatus ? (
        <p className="text-sm text-green-600 mt-2">Content Status: Saved</p>
      ) : (
        <p className="text-sm text-red-600 mt-2">Content Status: Not Saved</p>
      )}

      <button
        type="button"
        className="mt-4 rounded bg-green-600 text-white px-4 py-2 hover:bg-green-700 text-sm font-medium transition"
        onClick={() => updateContent(instance)}
      >
        Save Content Data
      </button>
      <p className="text-xs text-gray-500 mt-2">Click save before submitting the campaign.</p>
    </div>
  );
};

// --- Sub-Component: File Uploader ---
const FileUploader = ({ selectedFiles, onFilesChange, isUploading }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    console.log(
      '[Flow: Files Selected]',
      newFiles.map((f) => f.name)
    );
    onFilesChange([...selectedFiles, ...newFiles]);
  };

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Attachments</h3>
      <div
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${!isUploading ? 'hover:border-blue-400 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <p className="text-gray-600">
          Drag & drop or <span className="text-blue-600 underline font-medium">browse</span>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={isUploading}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2 p-3 border rounded-lg bg-gray-50">
          {selectedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 rounded bg-white shadow-sm">
              <div className="flex items-center space-x-3 truncate">
                <span>{getFileIcon(file.type)}</span>
                <span className="text-sm font-medium truncate">{file.name}</span>
              </div>
              {!isUploading && (
                <button
                  type="button"
                  onClick={() => onFilesChange(selectedFiles.filter((f) => f.id !== file.id))}
                  className="text-red-500 p-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Sub-Component: Task Assigner ---
const TaskAssigner = ({ users, selectedUsers, onUserChange, remark, onRemarkChange, level, onLevelChange }) => (
  <div className="mt-4 bg-white p-4 rounded-xl border border-gray-200">
    <h3 className="pb-4 text-lg font-semibold">Assign Campaign Task</h3>
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium block mb-1">Select Users</label>
        <Select options={users} isMulti value={selectedUsers} onChange={onUserChange} placeholder="Select users..." />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium block mb-1">Remark</label>
          <input
            className="border w-full rounded-lg px-3 py-2"
            value={remark}
            onChange={(e) => onRemarkChange(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium block mb-1">Priority Level</label>
          <select
            className="border w-full rounded-lg px-3 py-2"
            value={level}
            onChange={(e) => onLevelChange(e.target.value)}
          >
            <option value="URGENT">Urgent</option>
            <option value="VERY_URGENT">Very urgent</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component: Program Builder ---
const ProgramBuilder = ({ onSuccess }) => {
  const [campaign, setCampaign] = useState({
    id: Date.now(),
    CampaignName: '',
    Code: '',
    LeadGoal: '',
    Volumes: [{ key: '', value: '' }],
    Deadline: '',
    FirstUploadDate: '',
    WeeklyUploadDay: [],
    clients: [],
    ContactsPerCompany: '',
    Pacing: 'Even',
    Content: [],
    AdditionalInformation: '',
    DescriptionOfFilesAttached: '',
  });

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [taskLevel, setTaskLevel] = useState('URGENT');
  const [remark, setRemark] = useState('Default');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.user.value);
  const { uploadFiles, uploadProgress, isUploading } = useDropboxUpload();

  // Initialization Flow
  useEffect(() => {
    console.log('[Flow: Initializing Program Builder]');
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users`);
        const data = await res.json();
        setUsers(data.map((u) => ({ value: u.id, label: u.name || u.email })));
      } catch (e) {
        console.error('User fetch failed', e);
      }
    };
    fetchUsers();

    const saved = localStorage.getItem('campaignBuilder');
    if (saved) {
      console.log('[Flow: Session restored from localStorage]');
      setCampaign(JSON.parse(saved));
    }
  }, []);

  // Save to LocalStorage on every change
  useEffect(() => {
    localStorage.setItem('campaignBuilder', JSON.stringify({ ...campaign, Files: [] }));
  }, [campaign]);

  const handleChange = (field, value) => {
    console.log(`[Flow: Update Field] ${field}:`, value);
    setCampaign((prev) => ({ ...prev, [field]: value }));
  };

  const handleDynamicChange = (index, field, value) => {
    const newVolumes = [...campaign.Volumes];
    newVolumes[index][field] = value;
    setCampaign((prev) => ({ ...prev, Volumes: newVolumes }));
  };

  // --- SUBMISSION FLOW ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[Flow: Submission Started]', campaign);

    if (!campaign.CampaignName || !campaign.Code) {
      toast.error('Name and Code are required');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Starting multi-step submission...');

    try {
      // Step 1: Dropbox Upload
      console.log('[Flow: Step 1/4] Uploading Files...');
      const folderName = `${campaign.CampaignName}_${campaign.Code}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      const uploadedFiles = await uploadFiles(
        selectedFiles.map((f) => f.file),
        folderName
      );
      console.log('[Flow: Dropbox Success]', uploadedFiles);

      // Step 2: Create Campaign API
      console.log('[Flow: Step 2/4] Saving Campaign to Database...');
      const campRes = await fetch(`${import.meta.env.VITE_BASE_URL}/create-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...campaign, Files: uploadedFiles }),
      });
      const campData = await campRes.json();
      if (!campRes.ok) throw new Error('Campaign creation failed');

      // Step 3: Create Task
      console.log('[Flow: Step 3/4] Creating Tasks...');
      const taskRes = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Campaign',
          typeId: campData.data.id,
          name: campData.data.name,
          status: 'Not Started',
          remark,
          level: taskLevel,
        }),
      });
      const taskData = await taskRes.json();

      // Step 4: Assign Task
      const userIds = selectedUsers.map((u) => u.value);
      if (userIds.length > 0 && taskData.data) {
        console.log('[Flow: Step 4/4] Assigning Users...');
        await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${taskData.data.id}/assign`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assignedById: user.userId, users: userIds }),
        });
      }

      console.log('[Flow: Full Submission Completed Successfully]');
      localStorage.removeItem('campaignBuilder');
      toast.success('Campaign created and tasks assigned!', { id: toastId });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('[Flow: Submission Failure]', err);
      toast.error(err.message || 'Error occurred', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Campaign Builder</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Campaign Name *"
            className="border p-2 rounded w-full"
            value={campaign.CampaignName}
            onChange={(e) => handleChange('CampaignName', e.target.value)}
            required
          />
          <input
            placeholder="Code *"
            className="border p-2 rounded w-full"
            value={campaign.Code}
            onChange={(e) => handleChange('Code', e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Lead Goal"
            className="border p-2 rounded w-full"
            value={campaign.LeadGoal}
            onChange={(e) => handleChange('LeadGoal', e.target.value)}
          />
          <input
            type="number"
            placeholder="Contacts Per Company"
            className="border p-2 rounded w-full"
            value={campaign.ContactsPerCompany}
            onChange={(e) => handleChange('ContactsPerCompany', e.target.value)}
          />
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Clients</label>
            <Select
              isMulti
              options={clientOptions}
              value={clientOptions.filter((o) => campaign.clients.includes(o.value))}
              onChange={(s) =>
                handleChange(
                  'clients',
                  s.map((v) => v.value)
                )
              }
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="text-xs font-bold text-gray-500">
            DEADLINE
            <input
              type="date"
              className="border p-2 rounded w-full block mt-1"
              value={campaign.Deadline}
              onChange={(e) => handleChange('Deadline', e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-gray-500">
            FIRST UPLOAD
            <input
              type="date"
              className="border p-2 rounded w-full block mt-1"
              value={campaign.FirstUploadDate}
              onChange={(e) => handleChange('FirstUploadDate', e.target.value)}
            />
          </label>
          <label className="text-xs font-bold text-gray-500">
            WEEKLY UPLOAD DAYS
            <Select
              isMulti
              options={dayOptions}
              className="mt-1"
              value={dayOptions.filter((o) => campaign.WeeklyUploadDay.includes(o.value))}
              onChange={(s) =>
                handleChange(
                  'WeeklyUploadDay',
                  s.map((v) => v.value)
                )
              }
            />
          </label>
        </div>

        {/* Dynamic Volumes */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Volumes</h3>
            <button
              type="button"
              onClick={() => handleChange('Volumes', [...campaign.Volumes, { key: '', value: '' }])}
              className="text-blue-600 text-xs"
            >
              + Add Row
            </button>
          </div>
          {campaign.Volumes.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                placeholder="Key"
                className="border p-2 rounded flex-1"
                value={v.key}
                onChange={(e) => handleDynamicChange(i, 'key', e.target.value)}
              />
              <input
                placeholder="Value"
                className="border p-2 rounded flex-1"
                value={v.value}
                onChange={(e) => handleDynamicChange(i, 'value', e.target.value)}
              />
              {campaign.Volumes.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      'Volumes',
                      campaign.Volumes.filter((_, idx) => idx !== i)
                    )
                  }
                  className="text-red-400"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Spreadsheet Component (Auto-saves to campaign.Content) */}
        <Content setContent={(data) => handleChange('Content', data)} />

        {/* Rich Text Areas */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Additional Information</h3>
            <ReactQuill
              theme="snow"
              value={campaign.AdditionalInformation}
              onChange={(val) => handleChange('AdditionalInformation', val)}
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">File Descriptions</h3>
            <ReactQuill
              theme="snow"
              value={campaign.DescriptionOfFilesAttached}
              onChange={(val) => handleChange('DescriptionOfFilesAttached', val)}
            />
          </div>
        </div>

        <FileUploader
          selectedFiles={selectedFiles}
          onFilesChange={setSelectedFiles}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
        />

        <TaskAssigner
          users={users}
          selectedUsers={selectedUsers}
          onUserChange={setSelectedUsers}
          remark={remark}
          onRemarkChange={setRemark}
          level={taskLevel}
          onLevelChange={setTaskLevel}
        />

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center"
        >
          {isSubmitting || isUploading ? (
            <>
              <LoaderCircle className="animate-spin mr-3" />{' '}
              {isUploading ? 'Uploading Files...' : 'Processing Campaign...'}
            </>
          ) : (
            'Submit Campaign'
          )}
        </button>
      </form>
    </div>
  );
};

export default ProgramBuilder;
