// import { useState } from 'react';
// import { motion as Motion, AnimatePresence } from 'framer-motion';
// import { Pencil, Trash2, Save } from 'lucide-react';

// const ExternalRuleFetchAndEdit = ({ volumeId, externalRules}) => {
//   const [allExternalRules, setAllExternalRules] = useState(externalRules);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editData, setEditData] = useState(null);

//   const handleSave = async () => {
//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/external-rules?ruleIndex=${editIndex}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(editData),
//         }
//       );

//       if (res.ok) {
//         const result = await res.json();
//       } else {
//         const result = await res.json();
//         alert(result.message);
//       }
//     } catch (error) {
//       console.error('Edit error:', error);
//       alert('Failed to update rule.');
//     }
//   };

//   const handleDelete = async (index, modeName) => {
//     const confirmDelete = confirm(`Are you sure you want to delete "${modeName}" rule?`);

//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/external-rules?ruleIndex=${index}`,
//         { method: 'DELETE' }
//       );

//       if (res.ok) {
//         alert('Rule deleted');

//         const filtered = allExternalRules.filter((_, i) => i !== index);
//         setAllExternalRules(filtered);
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Delete failed');
//     }
//   };

//   const openEditModal = (index) => {
//     setEditIndex(index);
//     setEditData({ ...allExternalRules[index] });
//   };

//   const closeModal = () => {
//     setEditIndex(null);
//     setEditData(null);
//   };

//   return (
//     <div className="max-w-md">
//       <div>
//         <table className="w-full border-collapse text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-3 py-2 border-b">Mode</th>
//               <th className="px-3 py-2 border-b">Error</th>
//               <th className="px-3 py-2 border-b">Field Names</th>
//               <th className="px-3 py-2 border-b">Field Type</th>
//               <th className="px-3 py-2 border-b">Source Link</th>
//               <th className="px-3 py-2 border-b">Column Index</th>
//               <th className="px-3 py-2 border-b">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {allExternalRules.length > 0 ? (
//               allExternalRules.map((rule, index) => (
//                 <tr key={index} className="odd:bg-white even:bg-gray-50">
//                   <td className="px-3 py-2 border-t">{rule.mode}</td>
//                   <td className="px-3 py-2 border-t">{rule.error}</td>
//                   <td className="px-3 py-2 border-t">{rule.fieldNames?.join(', ') || '-'}</td>
//                   <td className="px-3 py-2 border-t">{rule?.source?.fieldType || '-'}</td>
//                   <td className="px-3 py-2 border-t">
//                     {rule?.source?.link ? `${rule.source.link.slice(0, 10)}...` : '-'}
//                   </td>
//                   <td className="px-3 py-2 border-t">{rule?.source?.valueField ?? '-'}</td>

//                   <td className="px-3 py-2 border-t">
//                     <div className="flex gap-3">
//                       <Pencil
//                         className="text-blue-600 cursor-pointer hover:text-blue-800"
//                         onClick={() => openEditModal(index)}
//                       />
//                       <Trash2
//                         className="text-red-500 cursor-pointer hover:text-red-700"
//                         onClick={() => handleDelete(index, rule.mode)}
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={7} className="text-center py-4 text-gray-500">
//                   No rules found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <AnimatePresence>
//         {editIndex !== null && (
//           <Motion.div
//             className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <Motion.div
//               className="bg-white p-6 rounded-xl w-112.5 shadow-lg"
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//             >
//               <h2 className="text-lg font-semibold mb-4">Edit Rule</h2>

//               <label className="text-sm">Mode</label>
//               <select
//                 className="w-full border p-2 rounded mb-3"
//                 value={editData.mode}
//                 onChange={(e) => setEditData({ ...editData, mode: e.target.value })}
//               >
//                 <option value="">Select</option>
//                 <option value="inclusion">Inclusion</option>
//                 <option value="exclusion">Exclusion</option>
//               </select>

//               <label className="text-sm">Error</label>
//               <input
//                 className="w-full border p-2 rounded mb-3"
//                 value={editData.error}
//                 onChange={(e) => setEditData({ ...editData, error: e.target.value })}
//               />

//               <label className="text-sm">Field Names</label>
//               <input
//                 className="w-full border p-2 rounded mb-3"
//                 value={editData.fieldNames?.join(', ')}
//                 onChange={(e) =>
//                   setEditData({
//                     ...editData,
//                     fieldNames: e.target.value.split(','),
//                   })
//                 }
//               />

//               <label className="text-sm">Source Field Type</label>
//               <input
//                 className="w-full border p-2 rounded mb-3"
//                 value={editData.source?.fieldType || ''}
//                 onChange={(e) =>
//                   setEditData({
//                     ...editData,
//                     source: { ...editData.source, fieldType: e.target.value },
//                   })
//                 }
//               />

//               <label className="text-sm">Source Link</label>
//               <input
//                 className="w-full border p-2 rounded mb-3"
//                 value={editData.source?.link || ''}
//                 onChange={(e) =>
//                   setEditData({
//                     ...editData,
//                     source: { ...editData.source, link: e.target.value },
//                   })
//                 }
//               />

//               <label className="text-sm">Column Index</label>
//               <input
//                 type="number"
//                 className="w-full border p-2 rounded mb-4"
//                 value={editData.source?.valueField ?? ''}
//                 onChange={(e) =>
//                   setEditData({
//                     ...editData,
//                     source: {
//                       ...editData.source,
//                       valueField: Number(e.target.value),
//                     },
//                   })
//                 }
//               />

//               <div className="flex justify-end gap-3">
//                 <button className="px-4 py-2 bg-gray-300 rounded" onClick={closeModal}>
//                   Cancel
//                 </button>
//                 <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave}>
//                   <Save className="inline w-4 h-4 mr-1" />
//                   Save
//                 </button>
//               </div>
//             </Motion.div>
//           </Motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ExternalRuleFetchAndEdit;

import { useState, useEffect } from 'react'; // Added useEffect
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const ExternalRuleFetchAndEdit = ({ volumeId, externalRules }) => {
  const [allExternalRules, setAllExternalRules] = useState(externalRules);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  // CRITICAL: Sync local state when the parent prop updates
  useEffect(() => {
    setAllExternalRules(externalRules);
  }, [externalRules]);

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/external-rules?ruleIndex=${editIndex}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editData),
        }
      );

      if (res.ok) {
        // Update local UI immediately for edit
        const updated = [...allExternalRules];
        updated[editIndex] = editData;
        setAllExternalRules(updated);
        setEditIndex(null);
        toast.success('Rule updated');
      } else {
        const result = await res.json();
        alert(result.message);
      }
    } catch (error) {
      console.error('Edit error:', error);
      alert('Failed to update rule.');
    }
  };

  const handleDelete = async (index, modeName) => {
    if (!confirm(`Are you sure you want to delete "${modeName}" rule?`)) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/volumes/${volumeId}/validation/external-rules?ruleIndex=${index}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        // Update local UI immediately for delete
        const filtered = allExternalRules.filter((_, i) => i !== index);
        setAllExternalRules(filtered);
      }
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const openEditModal = (index) => {
    setEditIndex(index);
    setEditData({ ...allExternalRules[index] });
  };

  const closeModal = () => {
    setEditIndex(null);
    setEditData(null);
  };

  return (
    <div className="w-full overflow-x-auto">
      {' '}
      {/* Changed max-w-md to full for tables */}
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 border-b text-left">Mode</th>
            <th className="px-3 py-2 border-b text-left">Error</th>
            <th className="px-3 py-2 border-b text-left">Fields</th>
            <th className="px-3 py-2 border-b text-left">Type</th>
            <th className="px-3 py-2 border-b text-left">Link</th>
            <th className="px-3 py-2 border-b text-left">Col</th>
            <th className="px-3 py-2 border-b text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {allExternalRules.map((rule, index) => (
            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b">
              <td className="px-3 py-2">{rule.mode}</td>
              <td className="px-3 py-2">{rule.error}</td>
              <td className="px-3 py-2">{rule.fieldNames?.join(', ') || '-'}</td>
              <td className="px-3 py-2">{rule?.source?.fieldType || '-'}</td>
              <td className="px-3 py-2 text-blue-600 truncate max-w-25">
                {rule?.source?.link ? (
                  <a href={rule.source.link} target="_blank" rel="noreferrer">
                    File
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-3 py-2">{rule?.source?.valueField ?? '-'}</td>
              <td className="px-3 py-2">
                <div className="flex justify-center gap-3">
                  <Pencil className="w-4 h-4 text-blue-600 cursor-pointer" onClick={() => openEditModal(index)} />
                  <Trash2
                    className="w-4 h-4 text-red-500 cursor-pointer"
                    onClick={() => handleDelete(index, rule.mode)}
                  />
                </div>
              </td>
            </tr>
          ))}
          {allExternalRules.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-400">
                No external rules defined.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Modal remains the same... */}
      <AnimatePresence>
        {editIndex !== null && (
          <Motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Motion.div
              className="bg-white p-6 rounded-xl w-112.5 shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-lg font-semibold mb-4">Edit Rule</h2>

              <label className="text-sm">Mode</label>
              <select
                className="w-full border p-2 rounded mb-3"
                value={editData.mode}
                onChange={(e) => setEditData({ ...editData, mode: e.target.value })}
              >
                <option value="">Select</option>
                <option value="inclusion">Inclusion</option>
                <option value="exclusion">Exclusion</option>
              </select>

              <label className="text-sm">Error</label>
              <input
                className="w-full border p-2 rounded mb-3"
                value={editData.error}
                onChange={(e) => setEditData({ ...editData, error: e.target.value })}
              />

              <label className="text-sm">Field Names</label>
              <input
                className="w-full border p-2 rounded mb-3"
                value={editData.fieldNames?.join(', ')}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    fieldNames: e.target.value.split(','),
                  })
                }
              />

              <label className="text-sm">Source Field Type</label>
              <input
                className="w-full border p-2 rounded mb-3"
                value={editData.source?.fieldType || ''}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    source: { ...editData.source, fieldType: e.target.value },
                  })
                }
              />

              <label className="text-sm">Source Link</label>
              <input
                className="w-full border p-2 rounded mb-3"
                value={editData.source?.link || ''}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    source: { ...editData.source, link: e.target.value },
                  })
                }
              />

              <label className="text-sm">Column Index</label>
              <input
                type="number"
                className="w-full border p-2 rounded mb-4"
                value={editData.source?.valueField ?? ''}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    source: {
                      ...editData.source,
                      valueField: Number(e.target.value),
                    },
                  })
                }
              />

              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={closeModal}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSave}>
                  <Save className="inline w-4 h-4 mr-1" />
                  Save
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExternalRuleFetchAndEdit;
