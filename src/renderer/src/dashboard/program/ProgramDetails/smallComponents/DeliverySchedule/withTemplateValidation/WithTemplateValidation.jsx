// import { useState, useEffect } from 'react';
// import { JsonEditor } from 'json-edit-react';
// import ExcelTemplateGenerator from './ExcelLeadGenerator';
// import ExternalRule from './ExternalRule';
// import ExternalRuleFetchAndEdit from './ExternalRuleFetchAndEdit';
// import { toast } from 'react-hot-toast';

// export default function WithTemplateValidation({ volumeId, volumeValidationProfile, vName, externalRules }) {
//   const [fieldRules, setFieldRules] = useState({});
//   const [valueRules, setValueRules] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [jsonStatus, setJsonStatus] = useState('');

//   const [hasData, setHasData] = useState(false);

//   useEffect(() => {
//     const initialFieldRules = volumeValidationProfile?.fieldRules || {};
//     const initialValueRules = volumeValidationProfile?.valueRules || [];

//     setFieldRules(initialFieldRules);
//     setValueRules(initialValueRules);

//     const hasInitialData = Object.keys(initialFieldRules).length > 0 || initialValueRules.length > 0;
//     setHasData(hasInitialData);

//     setJsonStatus('');
//   }, [volumeId, volumeValidationProfile, vName]);

//   const handleSchemaGenerated = (schema) => {
//     setFieldRules(schema.fieldRules || {});
//     setValueRules(schema.valueRules || []);
//     setHasData(true);
//     setJsonStatus('New rules generated from Excel. Click Upload to apply.');
//     toast.success('Rules generated from Excel!');
//   };

//   const handleUpload = async () => {
//     setIsUploading(true);

//     const loadingToast = toast.loading('Uploading validation rules...');

//     try {
//       const payload = { fieldRules, valueRules };
//       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/internal-rules`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);

//       toast.success('Validation rules updated successfully!', { id: loadingToast });

//       setTimeout(() => {
//         window.location.reload();
//       }, 800);
//     } catch (err) {
//       console.error('[Flow: Upload Error]', err);
//       toast.error('Failed to upload rules.', { id: loadingToast });
//       setIsUploading(false);
//     }
//   };

// const handleJsonChange = (updatedJson) => {}

//   const isButtonDisabled = isUploading || !hasData;

//   return (
//     <div className="space-y-8">
//       <div className="border-b pb-4 pr-10 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{vName}</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage validation logic and constraints</p>
//         </div>
//         <div
//           className={`px-4 py-2 rounded-lg text-xs font-bold border ${
//             volumeValidationProfile && Object.keys(volumeValidationProfile).length > 0
//               ? 'bg-green-50 text-green-700 border-green-200'
//               : 'bg-red-50 text-red-600 border-red-200'
//           }`}
//         >
//           {volumeValidationProfile && Object.keys(volumeValidationProfile).length > 0
//             ? '● VALIDATION ACTIVE'
//             : '○ NO VALIDATION SET'}
//         </div>
//       </div>

//       <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
//         <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">JSON Editor (With Template)</h4>

//         <ExcelTemplateGenerator onSchemaGenerated={handleSchemaGenerated} />

//         <div className="flex flex-col gap-4 mt-6">
//           <button
//             onClick={handleUpload}
//             disabled={isButtonDisabled}
//             className={`w-full md:w-auto flex items-center justify-center gap-2 px-10 py-3 rounded-lg text-sm font-bold transition-all active:scale-95 ${
//               isButtonDisabled
//                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
//                 : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
//             }`}
//           >
//             {isUploading ? 'UPLOADING...' : 'UPLOAD & REFRESH'}
//           </button>

//           {!hasData && (
//             <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
//               Please upload an Excel template to enable upload
//             </p>
//           )}
//         </div>
//       </div>

//       {jsonStatus && (
//         <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-medium">
//           {jsonStatus}
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
//           <div className="flex item-center justify-between">
//             <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Internal Rules (JSON)</h2>
//             <button className="border p-2 rounded">Edit Rules</button>
//           </div>

//           <div className="flex-1 min-h-100 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
//             <JsonEditor
//               data={{ fieldRules, valueRules }}
//               onChange={(updatedJson) => {
//                 setFieldRules(updatedJson.fieldRules || {});
//                 setValueRules(updatedJson.valueRules || []);
//                 // Enable button if user types manual JSON
//                 if (Object.keys(updatedJson.fieldRules || {}).length > 0) setHasData(true);
//               }}
//               collapsed={false}
//               rootName={false}
//             />
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
//           <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">External Rules</h2>
//           <div className="space-y-6">
//             <ExternalRule volumeId={volumeId} />
//             <ExternalRuleFetchAndEdit volumeId={volumeId} externalRules={externalRules} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect, useCallback } from 'react'; // Added useMemo
// import { JsonEditor } from 'json-edit-react';
// import ExcelTemplateGenerator from './ExcelLeadGenerator';
// import ExternalRule from './ExternalRule';
// import ExternalRuleFetchAndEdit from './ExternalRuleFetchAndEdit';
// import { toast } from 'react-hot-toast';

// export default function WithTemplateValidation({ volumeId, volumeValidationProfile, vName, externalRules, files }) {
//   const [internalRules, setInternalRules] = useState({
//     fieldRules: {},
//     valueRules: [],
//   });

//   const [isUploading, setIsUploading] = useState(false);
//   const [jsonStatus, setJsonStatus] = useState('');
//   const [hasData, setHasData] = useState(false);
//   const [currentExternalRules, setCurrentExternalRules] = useState(externalRules || []);

//   useEffect(() => {
//     const fieldRules = volumeValidationProfile?.fieldRules || {};
//     const valueRules = volumeValidationProfile?.valueRules || [];

//     setInternalRules({ fieldRules, valueRules });

//     const hasInitialData = Object.keys(fieldRules).length > 0 || valueRules.length > 0;
//     setHasData(hasInitialData);
//     setJsonStatus('');
//   }, [volumeId, volumeValidationProfile]);

//   const handleRuleAdded = (newRule) => {
//     setCurrentExternalRules((prev) => [...prev, newRule]);
//   };
//   const handleSchemaGenerated = (schema) => {
//     const newRules = {
//       fieldRules: schema.fieldRules || {},
//       valueRules: schema.valueRules || [],
//     };
//     setInternalRules(newRules);
//     setHasData(true);
//     setJsonStatus('New rules generated from Excel. Click Save to apply.');
//     toast.success('Rules generated from Excel!');
//   };

//   const updateInternalRules = async () => {
//     if (!hasData) return toast.error('No rules to save!');

//     setIsUploading(true);
//     const loadingToast = toast.loading('Saving validation rules...');

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/internal-rules`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(internalRules),
//       });

//       if (!res.ok) throw new Error(`Update failed: ${res.status}`);

//       toast.success('Validation rules saved successfully!', { id: loadingToast });
//       setTimeout(() => window.location.reload(), 800);
//     } catch (err) {
//       console.error('[Update Error]', err);
//       toast.error('Failed to save rules.', { id: loadingToast });
//       setIsUploading(false);
//     }
//   };

//   const handleJsonChange = useCallback((updatedJson) => {
//     setInternalRules(updatedJson);
//     if (Object.keys(updatedJson.fieldRules || {}).length > 0) {
//       setHasData(true);
//     }
//   }, []);

//   const isButtonDisabled = isUploading || !hasData;

//   return (
//     <div className="space-y-8">
//       <div className="border-b pb-4 pr-10 flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{vName}</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage validation logic and constraints</p>
//         </div>
//         <div
//           className={`px-4 py-2 rounded-lg text-xs font-bold border ${hasData ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}
//         >
//           {hasData ? '● VALIDATION ACTIVE' : '○ NO VALIDATION SET'}
//         </div>
//       </div>

//       <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
//         <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">JSON Editor (With Template)</h4>
//         <ExcelTemplateGenerator onSchemaGenerated={handleSchemaGenerated} />
//         <div className="mt-6">
//           <button
//             onClick={updateInternalRules}
//             disabled={isButtonDisabled}
//             className={`px-10 py-3 rounded-lg text-sm font-bold transition-all active:scale-95 ${
//               isButtonDisabled
//                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                 : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
//             }`}
//           >
//             {isUploading ? 'SAVING...' : 'UPLOAD '}
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Internal Rules (JSON)</h2>
//             <button
//               onClick={updateInternalRules}
//               disabled={isButtonDisabled}
//               className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all border ${
//                 isButtonDisabled
//                   ? 'bg-gray-50 text-gray-400'
//                   : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 shadow-sm'
//               }`}
//             >
//               {isUploading ? 'SAVING...' : 'SAVE CHANGES'}
//             </button>
//           </div>

//           <div className="flex-1 min-h-100 border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
//             <JsonEditor data={internalRules} onChange={handleJsonChange} collapsed={false} rootName={false} />
//           </div>
//         </div>

//         <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
//           <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">External Rules</h2>
//           <div className="space-y-6">
//             <ExternalRule volumeId={volumeId} files={files} onRuleAdded={handleRuleAdded} />
//             <ExternalRuleFetchAndEdit volumeId={volumeId} externalRules={currentExternalRules} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react'; // Simple, robust editor
import ExcelTemplateGenerator from './ExcelLeadGenerator';
import ExternalRule from './ExternalRule';
import ExternalRuleFetchAndEdit from './ExternalRuleFetchAndEdit';
import { toast } from 'react-hot-toast';

export default function WithTemplateValidation({ volumeId, volumeValidationProfile, vName, externalRules, files }) {
  const [internalRules, setInternalRules] = useState({
    fieldRules: {},
    valueRules: [],
  });

  // Local string state for the editor to prevent cursor jumps and handle invalid JSON typing
  const [editorValue, setEditorValue] = useState(JSON.stringify(internalRules, null, 2));
  const [isUploading, setIsUploading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [currentExternalRules, setCurrentExternalRules] = useState(externalRules || []);

  // Sync state when profile loads
  useEffect(() => {
    const fieldRules = volumeValidationProfile?.fieldRules || {};
    const valueRules = volumeValidationProfile?.valueRules || [];
    const initialObj = { fieldRules, valueRules };

    setInternalRules(initialObj);
    setEditorValue(JSON.stringify(initialObj, null, 2));

    const hasInitialData = Object.keys(fieldRules).length > 0 || valueRules.length > 0;
    setHasData(hasInitialData);
  }, [volumeId, volumeValidationProfile]);

  const handleRuleAdded = (newRule) => {
    setCurrentExternalRules((prev) => [...prev, newRule]);
  };

  const handleSchemaGenerated = (schema) => {
    const newRules = {
      fieldRules: schema.fieldRules || {},
      valueRules: schema.valueRules || [],
    };
    setInternalRules(newRules);
    setEditorValue(JSON.stringify(newRules, null, 2));
    setHasData(true);
    toast.success('Rules generated from Excel!');
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
    try {
      const parsed = JSON.parse(value);
      setInternalRules(parsed);
      setHasData(Object.keys(parsed.fieldRules || {}).length > 0);
    } catch (e) {
      // Silently fail while typing; "Save" button can be disabled if JSON is invalid
      console.error(e);
    }
  };

  // const updateInternalRules = async () => {
  //   try {
  //     // Final validation before sending
  //     const finalPayload = JSON.parse(editorValue);

  //     setIsUploading(true);
  //     const loadingToast = toast.loading('Saving validation rules...');

  //     const res = await fetch(`${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/internal-rules`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(finalPayload),
  //     });

  //     if (!res.ok) throw new Error(`Update failed: ${res.status}`);

  //     toast.success('Validation rules saved successfully!', { id: loadingToast });
  //     // setTimeout(() => window.location.reload(), 800);
  //   } catch (err) {
  //     toast.error(err instanceof SyntaxError ? 'Invalid JSON format!' : 'Failed to save rules.');
  //     setIsUploading(false);
  //   }
  // };

  const updateInternalRules = async () => {
    try {
      const finalPayload = JSON.parse(editorValue);
      setIsUploading(true);
      const loadingToast = toast.loading('Saving validation rules...');

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/internal-rules`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (!res.ok) throw new Error(`Update failed: ${res.status}`);

      toast.success('Validation rules saved successfully!', { id: loadingToast });

      // REMOVE THIS LINE:
      // setTimeout(() => window.location.reload(), 800);

      // DO THIS INSTEAD:
      setIsUploading(false);
      // If you need to fetch new data, call a prop from the parent here:
      // props.onRefresh();
    } catch (err) {
      toast.error(err instanceof SyntaxError ? 'Invalid JSON format!' : 'Failed to save rules.');
      setIsUploading(false);
    }
  };

  const isButtonDisabled = isUploading || !hasData;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-4 pr-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{vName}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage validation logic and constraints</p>
        </div>
        <div
          className={`px-4 py-2 rounded-lg text-xs font-bold border ${hasData ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}
        >
          {hasData ? '● VALIDATION ACTIVE' : '○ NO VALIDATION SET'}
        </div>
      </div>

      {/* Excel Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Quick Actions</h4>
        <ExcelTemplateGenerator onSchemaGenerated={handleSchemaGenerated} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monaco Editor Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Internal Rules</h2>
            <button
              type="button" // Add this to ensure it doesn't submit a form
              onClick={(e) => {
                e.preventDefault();
                updateInternalRules();
              }}
              // onClick={updateInternalRules}
              disabled={isButtonDisabled}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all border ${
                isButtonDisabled
                  ? 'bg-gray-50 text-gray-400'
                  : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 shadow-sm'
              }`}
            >
              {isUploading ? 'SAVING...' : 'SAVE CHANGES'}
            </button>
          </div>

          <div className="flex-1 min-h-100 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-light" // or "vs-dark"
              value={editorValue}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                scrollBeyondLastLine: false,
                formatOnPaste: true,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* External Rules Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">External Rules</h2>
          <div className="space-y-6">
            <ExternalRule volumeId={volumeId} files={files} onRuleAdded={handleRuleAdded} />
            <ExternalRuleFetchAndEdit volumeId={volumeId} externalRules={currentExternalRules} />
          </div>
        </div>
      </div>
    </div>
  );
}
