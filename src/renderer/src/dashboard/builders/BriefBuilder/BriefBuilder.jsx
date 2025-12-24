import Select from 'react-select';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import 'jsuites/dist/jsuites.css';
import { useDropboxUpload } from '../../../hooks/useDropboxUpload';

const fromISTDateAndTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const [year, month, day] = dateStr.split('-').map(Number);
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes) - istOffsetMs);
  return utcDate.toISOString();
};

const getCurrentISTDateTime = () => {
  const now = new Date();
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istDateObj = new Date(utc + istOffsetMs);
  const dateStr = istDateObj.toISOString().slice(0, 10);
  const hours = istDateObj.getHours();
  const minutes = istDateObj.getMinutes();
  const pad = (n) => n.toString().padStart(2, '0');
  return { date: dateStr, time: `${pad(hours)}:${pad(minutes)}` };
};

const addOneHour = (timeStr) => {
  let [h, m] = timeStr.split(':').map(Number);
  h = (h + 1) % 24;
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}`;
};

const getFileIcon = (fileType) => {
  if (fileType.includes('image')) return '🖼️';
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
  if (fileType.includes('zip') || fileType.includes('compressed')) return '📦';
  return '📎';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const SpreadsheetEditor = ({ title, onInstanceReady }) => {
  const sheetRef = useRef(null);
  return (
    <div className="p-3 border rounded-lg bg-gray-50">
      <Spreadsheet ref={sheetRef} tabs={false} onload={(i) => onInstanceReady(i)}>
        <Worksheet title={title || 'Sheet1'} minDimensions={[5, 3]} />
      </Spreadsheet>
    </div>
  );
};

const FileUploader = ({ selectedFiles, onFilesChange, uploadProgress, isUploading }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
    }));
    onFilesChange([...selectedFiles, ...newFiles]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (!isUploading) handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (fileId) => {
    onFilesChange(selectedFiles.filter((f) => f.id !== fileId));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Attachments</h3>
        <span className="text-sm text-gray-500">{selectedFiles.length} file(s) selected</span>
      </div>

      <div
        className={`mt-3 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${!isUploading ? 'hover:border-blue-400 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <p className="text-gray-600">
          Drag & drop files here or <span className="text-blue-600 underline font-medium">browse</span>
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
          <h4 className="font-medium text-sm border-b pb-2">Files Ready:</h4>
          {selectedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 rounded bg-white shadow-sm">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <span className="text-lg">{getFileIcon(file.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              {!isUploading && (
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-700 ml-2 p-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isUploading && selectedFiles.length > 0 && (
        <div className="mt-4 p-3 border rounded-lg bg-blue-50">
          <h4 className="font-semibold text-blue-800 text-sm mb-2">Uploading...</h4>
          {selectedFiles.map((file) => (
            <div key={file.id} className="space-y-1 my-1">
              <div className="flex justify-between text-xs text-blue-700">
                <span className="truncate">{file.name}</span>
                <span>{uploadProgress[file.name] ? uploadProgress[file.name].toFixed(0) : 0}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress[file.name] || 0}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TaskAssigner = ({ users, selectedUsers, onUserChange, remark, onRemarkChange, level, onLevelChange }) => {
  return (
    <div className="mt-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
      <h3 className="pb-4 text-lg font-semibold">Assign Brief</h3>

      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="user-select" className="font-medium">
          Select Users
        </label>
        <Select
          id="user-select"
          options={users}
          isMulti
          value={selectedUsers}
          onChange={onUserChange}
          placeholder="Select users..."
          classNamePrefix="react-select"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col flex-1">
          <label className="font-medium mb-1">Remark</label>
          <input
            placeholder="Enter remark"
            className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2"
            value={remark}
            onChange={(e) => onRemarkChange(e.target.value)}
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="font-medium mb-1">Level</label>
          <select
            className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2"
            value={level}
            onChange={(e) => onLevelChange(e.target.value)}
          >
            <option value="URGENT">Urgent</option>
            <option value="VERY_URGENT">Very urgent</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export const BriefBuilder = ({ onSuccess }) => {
  const [leadSheetInstance, setLeadSheetInstance] = useState(null);
  const [quillText, setQuillText] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [taskLevel, setTaskLevel] = useState('URGENT');
  const [remark, setRemark] = useState('Default');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const { uploadFiles, uploadProgress, isUploading } = useDropboxUpload();
  const [formData, setFormData] = useState(() => {
    const arrived = getCurrentISTDateTime();
    return {
      clientCode: 'PH',
      name: '',
      arrivedOn: '',
      arrivedOnDate: arrived.date,
      arrivedOnTime: arrived.time,
      due: '',
      dueDate: arrived.date,
      dueTime: addOneHour(arrived.time),
      status: 'New',
      type: 'LEADGEN',
      remark: '',
      briefHyperlink: '',
    };
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const iso = fromISTDateAndTime(formData.arrivedOnDate, formData.arrivedOnTime);
    setFormData((prev) => ({ ...prev, arrivedOn: iso }));
  }, [formData.arrivedOnDate, formData.arrivedOnTime]);

  useEffect(() => {
    const iso = fromISTDateAndTime(formData.dueDate, formData.dueTime);
    setFormData((prev) => ({ ...prev, due: iso }));
  }, [formData.dueDate, formData.dueTime]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users`);
      const response = await res.json();
      setUsers(
        response.map((user) => ({
          value: user.id,
          label: user.name || user.email || `User ${user.id}`,
        }))
      );
    } catch (e) {
      console.error('Failed to fetch users', e);
    }
  };

  const createTask = async (campaignId, campaignName) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Breif',
          typeId: campaignId,
          name: campaignName,
          status: 'Not Started',
          remark: remark,
          level: taskLevel,
        }),
      });
      return await res.json();
    } catch (e) {
      console.error('Create task failed', e);
    }
  };

  const assignTask = async (taskId, assignedById, users) => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedById, users }),
      });
    } catch (e) {
      console.error('Assign task failed', e);
    }
  };

  const parseSheetData = (sheetInstance) => {
    if (!sheetInstance) return [];

    const sheet = sheetInstance.worksheets[0];
    const raw = sheet.getData();

    if (raw.length < 2) return [];

    const headers = raw[0]; // First row = column names
    const rows = raw.slice(1); // Remaining rows = data

    let result = [];

    rows.forEach((row) => {
      // Skip completely empty rows
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

  const handleUploadJSON = async () => {
    setLoading(true);
    try {
      const allLeadCountDetails = parseSheetData(leadSheetInstance);

      const finalPayload = [
        {
          'quote-template-1': allLeadCountDetails,
        },
      ];

      const folderName = `${formData.name}_${formData.arrivedOn}`.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filesToUpload = selectedFiles.map((f) => f.file);
      const uploadedFiles = await uploadFiles(filesToUpload, folderName);

      const jsonData = {
        ...formData,
        leadDetails: finalPayload,
        leadDetailsSection: quillText,
        files: uploadedFiles,
      };

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/briefs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });

      if (!res.ok) throw new Error('Brief creation failed');
      const response = await res.json();
      const data = response.data;

      // 5. Create & Assign Task
      const task = await createTask(data.id, data.name);
      const assignedUserIds = selectedUsers.map((e) => e.value);
      if (assignedUserIds.length > 0 && task?.data?.id) {
        await assignTask(task.data.id, 1, assignedUserIds);
      }
      setUploadStatus('Brief submitted successfully!');

      // 6. Trigger Parent Callback to Refresh and Close Drawer
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      console.error('Error:', e);

      setUploadStatus('Failed to submit brief.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-6">Brief Builder</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block font-semibold mb-1">Brief Name</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="Brief Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Client Code</label>
          <select
            value={formData.clientCode}
            onChange={(e) => handleInputChange('clientCode', e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="PH">PH</option>
            <option value="LPM">LPM</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="LEADGEN">LEADGEN</option>
            <option value="HTML">HTML</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Hyperlink</label>
          <input
            className="border p-2 rounded w-full"
            placeholder="Brief Hyperlink"
            value={formData.briefHyperlink}
            onChange={(e) => handleInputChange('briefHyperlink', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Arrived On Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={formData.arrivedOnDate}
            onChange={(e) => handleInputChange('arrivedOnDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Arrived On Time (IST)</label>
          <input
            type="time"
            className="border p-2 rounded w-full"
            value={formData.arrivedOnTime}
            onChange={(e) => handleInputChange('arrivedOnTime', e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Due Time (IST)</label>
          <input
            type="time"
            className="border p-2 rounded w-full"
            value={formData.dueTime}
            onChange={(e) => handleInputChange('dueTime', e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Due Date</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="New">New</option>
            <option value="InProgress">InProgress</option>
            <option value="Quoted">Quoted</option>
            <option value="NewUpdate">NewUpdate</option>
          </select>
        </div>
      </div>

      <h3 className="mt-10 mb-2 font-semibold text-lg">Lead Detail Sections</h3>
      <ReactQuill
        value={quillText}
        onChange={setQuillText}
        theme="snow"
        placeholder="Enter lead details. HTML gets saved."
      />

      <h3 className="mt-10 mb-2 font-semibold text-lg">Lead Count Details</h3>
      <SpreadsheetEditor title="LeadCount" onInstanceReady={setLeadSheetInstance} />

      <div className="mt-10">
        <FileUploader
          selectedFiles={selectedFiles}
          onFilesChange={setSelectedFiles}
          uploadProgress={uploadProgress}
          isUploading={isUploading}
        />
      </div>

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
        onClick={handleUploadJSON}
        // disabled={loading}
        disabled={loading || isUploading || selectedFiles.length === 0}
        // className={`mt-10 px-6 py-3 rounded-lg text-white w-full sm:w-auto ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600'
        //   }`}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {loading ? 'Uploading...' : 'Submit'}
      </button>

      <p className="mt-4">{uploadStatus}</p>
    </div>
  );
};
