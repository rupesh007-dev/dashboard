// import { CheckCircle, CirclePause, Edit, Trash } from 'lucide-react';
// import { useState } from 'react';
// import Select from 'react-select';
// import { FormatDate } from '../../../../components/common/FormatDate';

// const StatusIcon = ({ status }) => {
//   const isActive = status?.toLowerCase() === 'active';
//   return (
//     <span className="flex items-center gap-1">
//       {isActive ? (
//         <CheckCircle size={24} strokeWidth={2.5} color="green" />
//       ) : (
//         <CirclePause size={24} strokeWidth={2.5} color="red" />
//       )}
//       {status}
//     </span>
//   );
// };

// const statusOptions = [
//   { value: 'Active', label: 'Active' },
//   { value: 'Paused', label: 'Paused' },
//   { value: 'In-Review', label: 'In Review' },
//   { value: 'Completed', label: 'Completed' },
// ];

// const programTypeOptions = [
//   { value: 'SINGLE_TOUCH', label: 'SINGLE_TOUCH' },
//   { value: 'DOUBLE_TOUCH', label: 'DOUBLE_TOUCH' },
//   { value: 'RANDOM', label: 'RANDOM' },
// ];

// const uploadDaysOptions = [
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday',
//   'Saturday',
//   'Sunday',
//   'FrontLoad',
// ].map((d) => ({
//   value: d,
//   label: d,
// }));

// export const ProgramStatus = ({ data, programId }) => {
//   const [editingField, setEditingField] = useState(null);
//   const [editValue, setEditValue] = useState(null);
//   const [deleteField, setDeleteField] = useState(null);

//   const openEditModal = (field, currentValue) => {
//     setEditingField(field);

//     if (field === 'weeklyUploadDays') {
//       setEditValue(currentValue.split(',').map((d) => ({ value: d, label: d })));
//     } else {
//       setEditValue(currentValue);
//     }
//   };

//   const handleUpdate = async () => {
//     let payloadValue = editValue;

//     if (editingField === 'weeklyUploadDays') {
//       payloadValue = editValue.map((item) => item.value);
//     }

//     try {
//       await fetch(`${import.meta.env.VITE_BASE_URL}/campaigns/${programId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ [editingField]: payloadValue }),
//       });

//       setEditingField(null);
//       setEditValue('');
//     } catch (error) {
//       alert('Update failed: ' + error.message);
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await fetch(`${import.meta.env.VITE_BASE_URL}/campaigns/${programId}`, {
//         method: 'DELETE',
//       });

//       setDeleteField(null);
//     } catch (error) {
//       alert('Delete failed: ' + error.message);
//     }
//   };

//   const days = Array.isArray(data.weeklyUploadDays) ? data.weeklyUploadDays : JSON.parse(data.weeklyUploadDays || '[]');

//   return (
//     <>
//       {editingField && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 shadow-xl">
//             <h3 className="text-lg font-semibold mb-4 capitalize">Edit {editingField}</h3>

//             {editingField === 'status' && (
//               <Select
//                 options={statusOptions}
//                 value={statusOptions.find((o) => o.value === editValue)}
//                 onChange={(opt) => setEditValue(opt.value)}
//               />
//             )}

//             {editingField === 'campaignType' && (
//               <Select
//                 options={programTypeOptions}
//                 value={programTypeOptions.find((o) => o.value === editValue)}
//                 onChange={(opt) => setEditValue(opt.value)}
//               />
//             )}

//             {editingField === 'weeklyUploadDays' && (
//               <Select isMulti options={uploadDaysOptions} value={editValue} onChange={(opt) => setEditValue(opt)} />
//             )}

//             {(editingField === 'firstUploadDate' || editingField === 'duedate') && (
//               <input
//                 type="date"
//                 className="w-full px-3 py-2 border rounded dark:bg-gray-700"
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//               />
//             )}
//             {editingField === 'cpc' && (
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 border rounded dark:bg-gray-700"
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//               />
//             )}

//             {/* {!['status', 'campaignType', 'weeklyUploadDays'].includes(editingField) && (
//               <input
//                 type="text"
//                 className="w-full px-3 py-2 border rounded dark:bg-gray-700"
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//               />
//             )} */}

//             <div className="flex justify-end gap-3 mt-4">
//               <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setEditingField(null)}>
//                 Cancel
//               </button>

//               <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpdate}>
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {deleteField && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-5 rounded-lg w-80 shadow-xl">
//             <h3 className="text-lg font-semibold text-red-600">Confirm Delete</h3>
//             <p className="mt-2 text-gray-700 dark:text-gray-300">
//               Are you sure you want to delete <span className="font-semibold">{deleteField}</span>?
//             </p>

//             <div className="flex justify-end gap-3 mt-4">
//               <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setDeleteField(null)}>
//                 Cancel
//               </button>

//               <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDelete}>
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 text-sm space-y-4">
//         <div className="flex items-center justify-between">
//           <h4 className="text-lg font-medium text-gray-900 dark:text-white">Info</h4>
//         </div>
//         <div className="     text-sm space-y-4">
//           {[
//             {
//               label: 'Program Status',
//               value: <StatusIcon status={data.status} />,
//               raw: data.status,
//               field: 'status',
//             },
//             {
//               label: 'Program Type',
//               value: data.campaignType,
//               raw: data.campaignType,
//               field: 'campaignType',
//             },
//             {
//               label: 'First Upload',
//               value: FormatDate(data.firstUploadDate),
//               raw: data.firstUploadDate,
//               field: 'firstUploadDate',
//             },
//             {
//               label: 'Deadline',
//               value: FormatDate(data.duedate),
//               raw: data.duedate,
//               field: 'duedate',
//             },
//             {
//               label: 'Weekly Upload Days',
//               value: days.join(', '),
//               raw: days.join(','),
//               field: 'weeklyUploadDays',
//             },
//             {
//               label: 'CPC',
//               value: data.cpc,
//               raw: data.cpc,
//               field: 'cpc',
//             },
//           ].map((item) => (
//             <div key={item.field} className="">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-semibold dark:text-white">{item.label}</h3>

//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => openEditModal(item.field, item.raw)}
//                     className="text-blue-500 hover:text-blue-700"
//                   >
//                     <Edit size={16} />
//                   </button>

//                   <button onClick={() => setDeleteField(item.field)} className="text-red-500 hover:text-red-700">
//                     <Trash size={16} />
//                   </button>
//                 </div>
//               </div>

//               <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.value}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };
import { CheckCircle, CirclePause, Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import Select from 'react-select';
import { FormatDate } from '../../../../components/common/FormatDate';
import { Drawer } from '../../../../components/common/Drawer';

const StatusIcon = ({ status }) => {
  const isActive = status?.toLowerCase() === 'active';

  return (
    <span className="flex items-center gap-1">
      {isActive ? (
        <CheckCircle size={24} strokeWidth={2.5} color="green" />
      ) : (
        <CirclePause size={24} strokeWidth={2.5} color="red" />
      )}
      {status}
    </span>
  );
};

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Paused', label: 'Paused' },
  { value: 'In-Review', label: 'In Review' },
  { value: 'Completed', label: 'Completed' },
];

const programTypeOptions = [
  { value: 'SINGLE_TOUCH', label: 'SINGLE_TOUCH' },
  { value: 'DOUBLE_TOUCH', label: 'DOUBLE_TOUCH' },
  { value: 'RANDOM', label: 'RANDOM' },
];

const uploadDaysOptions = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'FrontLoad',
].map((d) => ({ value: d, label: d }));

export const ProgramStatus = ({ data, programId }) => {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState(null);
  const [deleteField, setDeleteField] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openEditModal = (field, currentValue) => {
    setEditingField(field);
    setIsDrawerOpen(true);

    if (field === 'weeklyUploadDays') {
      setEditValue(currentValue.split(',').map((d) => ({ value: d, label: d })));
    } else {
      setEditValue(currentValue);
    }
  };

  const handleUpdate = async () => {
    let payloadValue = editValue;

    if (editingField === 'weeklyUploadDays') {
      payloadValue = editValue.map((item) => item.value);
    }

    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/campaigns/${programId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [editingField]: payloadValue }),
      });

      setEditingField(null);
      setEditValue('');
      setIsDrawerOpen(false);
    } catch (error) {
      alert('Update failed: ' + error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/campaigns/${programId}`, {
        method: 'DELETE',
      });

      setDeleteField(null);
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  const days = Array.isArray(data.weeklyUploadDays) ? data.weeklyUploadDays : JSON.parse(data.weeklyUploadDays || '[]');

  return (
    <>
      {/* DELETE CONFIRMATION MODAL */}
      {/* {deleteField && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg w-80 shadow-xl">
            <h3 className="text-lg font-semibold text-red-600">Confirm Delete</h3>

            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Are you sure you want to delete <span className="font-semibold">{deleteField}</span>?
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setDeleteField(null)}>
                Cancel
              </button>

              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )} */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 text-sm space-y-4">
        {/* INFO CARD */}

        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Info</h4>

        {[
          {
            label: 'Program Status',
            value: <StatusIcon status={data.status} />,
            raw: data.status,
            field: 'status',
          },
          {
            label: 'Program Type',
            value: data.campaignType,
            raw: data.campaignType,
            field: 'campaignType',
          },
          {
            label: 'First Upload',
            value: FormatDate(data.firstUploadDate),
            raw: data.firstUploadDate,
            field: 'firstUploadDate',
          },
          {
            label: 'Deadline',
            value: FormatDate(data.duedate),
            raw: data.duedate,
            field: 'duedate',
          },
          {
            label: 'Weekly Upload Days',
            value: days.join(', '),
            raw: days.join(','),
            field: 'weeklyUploadDays',
          },
          {
            label: 'CPC',
            value: data.cpc,
            raw: data.cpc,
            field: 'cpc',
          },
        ].map((item) => (
          <div key={item.field}>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold dark:text-white">{item.label}</h3>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditModal(item.field, item.raw)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={16} />
                </button>

                <button onClick={() => setDeleteField(item.field)} className="text-red-500 hover:text-red-700">
                  <Trash size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.value}</p>
          </div>
        ))}

        {/* EDIT DRAWER */}
        {isDrawerOpen && (
          <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen} width="30%">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold capitalize">Edit {editingField}</h3>

              {editingField === 'status' && (
                <Select
                  options={statusOptions}
                  value={statusOptions.find((o) => o.value === editValue)}
                  onChange={(opt) => setEditValue(opt.value)}
                />
              )}

              {editingField === 'campaignType' && (
                <Select
                  options={programTypeOptions}
                  value={programTypeOptions.find((o) => o.value === editValue)}
                  onChange={(opt) => setEditValue(opt.value)}
                />
              )}

              {editingField === 'weeklyUploadDays' && (
                <Select isMulti options={uploadDaysOptions} value={editValue} onChange={(opt) => setEditValue(opt)} />
              )}

              {(editingField === 'firstUploadDate' || editingField === 'duedate') && (
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              )}

              {editingField === 'cpc' && (
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded dark:bg-gray-700"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </button>

                <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleUpdate}>
                  Save
                </button>
              </div>
            </div>
          </Drawer>
        )}
        {deleteField && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-101"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-sm text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to delete <span className="font-semibold">{deleteField}</span>?
              </p>

              <div className="flex justify-center gap-4">
                <button onClick={() => setDeleteField(null)} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600">
                  Cancel
                </button>
                <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white">
                  Sure
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
