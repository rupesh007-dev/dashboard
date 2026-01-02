// import { useState } from 'react';

// const ExternalRule = ({ volumeId,files }) => {
//   const [uploadStatus, setUploadStatus] = useState(null);

//   const [rules, setRules] = useState({
//     mode: '',
//     fieldNames: '',
//     fileLink: '',
//     fileType: 'xlsx',
//     valueField: '',
//     fieldType: '',
//     errorMessage: '',
//   });
//   // const [files,setFiles] = useState(files)
//   const handleChange = (field, value) => {
//     setRules((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };
//   const generateFinalJson = () => ({
//     mode: rules.mode,
//     fieldNames: rules.fieldNames
//       .split(',')
//       .map((f) => f.trim())
//       .filter((x) => x),
//     source: {
//       link: rules.fileLink,
//       fileType: rules.fileType,
//       valueField: Number(rules.valueField),
//       fieldType: rules.fieldType,
//     },
//     error: rules.errorMessage,
//   });

//   const handleSaveGenerateJson = async () => {
//     try {
//       const genjson = generateFinalJson();
//       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/external-rules`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(genjson),
//       });

//       if (!res.ok) {
//         throw new Error(`Failed with status ${res.status}`);
//       }

//       setUploadStatus('success');
//     } catch (err) {
//       console.error('Upload failed:', err);
//       setUploadStatus('error');
//     }
//   };

//   return (
//     <>
//       <div className="space-y-10">
//         <div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm font-medium text-black">Mode</label>
//               <select
//                 className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
//                 value={rules.mode}
//                 onChange={(e) => handleChange('mode', e.target.value)}
//               >
//                 <option value="">select</option>

//                 <option value="inclusion">inclusion</option>
//                 <option value="exclusion">exclusion</option>
//               </select>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-black">Field Names (comma separated)</label>
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
//                 value={rules.fieldNames}
//                 onChange={(e) => handleChange('fieldNames', e.target.value)}
//                 placeholder="email, mobile"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-black">File Link</label>
//               {/* <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
//                 value={rules.fileLink}
//                 onChange={(e) => handleChange('fileLink', e.target.value)}
//                 placeholder="https://fileLink...."
//               /> */}

//   <select
//                 className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
//                 value={rules.fileLink}
//                 onChange={(e) => handleChange('fileLink', e.target.value)}
//               >
//                 <option value="https://fileLink....">https://fileLink....</option>
//                 <option value="https://fileLink....">https://fileLink....</option>
//                 <option value="https://fileLink....">https://fileLink....</option>
//               </select>

//             </div>

//             <div>
//               <label className="text-sm font-medium text-black">File Type</label>
//               <select
//                 className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
//                 value={rules.fileType}
//                 onChange={(e) => handleChange('fileType', e.target.value)}
//               >
//                 <option value="xlsx">xlsx</option>
//                 <option value="csv">csv</option>
//                 <option value="json">json</option>
//               </select>
//             </div>

//             <div>
//               <label className="text-sm font-medium text-black">Column Index (0…)</label>
//               <input
//                 type="number"
//                 className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
//                 value={rules.valueField}
//                 onChange={(e) => handleChange('valueField', e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-black">Field Type</label>
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
//                 value={rules.fieldType}
//                 onChange={(e) => handleChange('fieldType', e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-black">Error Message</label>
//               <input
//                 className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
//                 value={rules.errorMessage}
//                 onChange={(e) => handleChange('errorMessage', e.target.value)}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <button onClick={handleSaveGenerateJson} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
//         ⬆ Upload
//       </button>

//       {uploadStatus === 'success' && <p className="mt-3 text-green-600">Upload successful!</p>}
//       {uploadStatus === 'error' && <p className="mt-3 text-red-600"> Upload failed. Try again.</p>}
//     </>
//   );
// };

// export default ExternalRule;
import { useState } from 'react';

const ExternalRule = ({ volumeId, files, onRuleAdded }) => {
  const [uploadStatus, setUploadStatus] = useState(null);

  const [rules, setRules] = useState({
    mode: '',
    fieldNames: '',
    fileLink: '', // This will store the selected link
    fileType: 'xlsx',
    valueField: '',
    fieldType: '',
    errorMessage: '',
  });

  const handleChange = (field, value) => {
    setRules((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateFinalJson = () => ({
    mode: rules.mode,
    fieldNames: rules.fieldNames
      .split(',')
      .map((f) => f.trim())
      .filter((x) => x),
    source: {
      link: rules.fileLink,
      fileType: rules.fileType,
      valueField: Number(rules.valueField),
      fieldType: rules.fieldType,
    },
    error: rules.errorMessage,
  });

  // const handleSaveGenerateJson = async () => {
  //   try {
  //     const genjson = generateFinalJson();
  //     const res = await fetch(`${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/external-rules`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(genjson),
  //     });

  //     if (!res.ok) throw new Error(`Failed with status ${res.status}`);

  //     setUploadStatus('success');
  //   } catch (err) {
  //     console.error('Upload failed:', err);
  //     setUploadStatus('error');
  //   }
  // };

  //   const handleSaveGenerateJson = async () => {
  //     try {
  //       const genjson = generateFinalJson();
  //       const res = await fetch(`${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/external-rules`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(genjson),
  //       });

  //       if (!res.ok) {
  //         throw new Error(`Failed with status ${res.status}`);
  //       }

  //       setUploadStatus('success');
  //     } catch (err) {
  //       console.error('Upload failed:', err);
  //       setUploadStatus('error');
  //     }
  //   };

  const handleSaveGenerateJson = async () => {
    try {
      const genjson = generateFinalJson();
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/external-rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(genjson),
      });

      if (!res.ok) throw new Error(`Failed with status ${res.status}`);

      const savedResponse = await res.json();
      // Use the response from server if it exists, otherwise use the local json
      const ruleToDisplay = savedResponse.externalRules || genjson;

      if (onRuleAdded) {
        onRuleAdded(ruleToDisplay);
      }

      setUploadStatus('success');
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStatus('error');
    }
  };

  return (
    <>
      <div className="space-y-10">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mode Select */}
            <div>
              <label className="text-sm font-medium text-black">Mode</label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
                value={rules.mode}
                onChange={(e) => handleChange('mode', e.target.value)}
              >
                <option value="">select</option>
                <option value="inclusion">inclusion</option>
                <option value="exclusion">exclusion</option>
              </select>
            </div>

            {/* Field Names */}
            <div>
              <label className="text-sm font-medium text-black">Field Names (comma separated)</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
                value={rules.fieldNames}
                onChange={(e) => handleChange('fieldNames', e.target.value)}
                placeholder="email, mobile"
              />
            </div>

            {/* Dynamic File Link Select */}
            <div>
              <label className="text-sm font-medium text-black">Select File</label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
                value={rules.fileLink}
                onChange={(e) => handleChange('fileLink', e.target.value)}
              >
                <option value="">Choose a file</option>
                {files &&
                  files.map((file) => (
                    <option key={file.id} value={file.link}>
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </option>
                  ))}
              </select>
            </div>

            {/* File Type */}
            <div>
              <label className="text-sm font-medium text-black">File Type</label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
                value={rules.fileType}
                onChange={(e) => handleChange('fileType', e.target.value)}
              >
                <option value="xlsx">xlsx</option>
                <option value="csv">csv</option>
                <option value="json">json</option>
              </select>
            </div>

            {/* Column Index */}
            <div>
              <label className="text-sm font-medium text-black">Column Index (0…)</label>
              <input
                type="number"
                className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
                value={rules.valueField}
                onChange={(e) => handleChange('valueField', e.target.value)}
              />
            </div>

            {/* Field Type */}
            <div>
              <label className="text-sm font-medium text-black">Field Type</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
                value={rules.fieldType}
                onChange={(e) => handleChange('fieldType', e.target.value)}
                placeholder="string, number..."
              />
            </div>

            {/* Error Message */}
            <div>
              <label className="text-sm font-medium text-black">Error Message</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 border-black"
                value={rules.errorMessage}
                onChange={(e) => handleChange('errorMessage', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSaveGenerateJson}
        disabled={!rules.fileLink || !rules.mode}
        className={`mt-4 px-4 py-2 rounded text-white ${!rules.fileLink ? 'bg-gray-400' : 'bg-blue-600'}`}
      >
        ⬆ Upload Rule
      </button>

      {uploadStatus === 'success' && <p className="mt-3 text-green-600">Upload successful!</p>}
      {uploadStatus === 'error' && <p className="mt-3 text-red-600"> Upload failed. Try again.</p>}
    </>
  );
};

export default ExternalRule;
