import { Download, Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { Drawer } from '../../../../components/common/Drawer';

export const FilesAttached = ({ data, programId, onRefresh }) => {
  const baseUrl = '${import.meta.env.VITE_BASE_URL}/campaigns';
  const [editingFile, setEditingFile] = useState(null);
  const [form, setForm] = useState({ name: '', date: '', link: '' });

  const openEditModal = (file) => {
    setEditingFile(file);
    setForm({
      name: file.name,
      date: file.date,
      link: file.link,
    });
  };

  const closeEditModal = () => {
    setEditingFile(null);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`${baseUrl}/${programId}/files?fileId=${editingFile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        closeEditModal();
        onRefresh();
      } else {
        const result = await res.json();
        alert(result.message);
      }
    } catch (error) {
      console.error('Edit error:', error);
      alert('Failed to update file.');
    }
  };

  const handleDelete = async (file) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${file.name}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${baseUrl}/${programId}/files?fileId=${file.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onRefresh();
      } else {
        const result = await res.json();
        alert(result.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file.');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Files Attached</h4>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <ul className="space-y-3 text-sm">
          {data?.map((f) => (
            <li
              key={f.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-gray-900 dark:text-white break-all">{f.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-300">{f.date}</span>
              </div>

              <div className="flex items-center gap-4 mt-3 sm:mt-0">
                <a
                  href={f.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2"
                >
                  <Download size={16} /> Download
                </a>

                <button onClick={() => openEditModal(f)} className="text-blue-500 hover:text-blue-700">
                  <Edit size={16} />
                </button>

                <button onClick={() => handleDelete(f)} className="text-red-500 hover:text-red-700">
                  <Trash size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {editingFile && (
          <Drawer open={editingFile} setOpen={setEditingFile} width="40%">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Edit File</h2>

            <div className="space-y-4">
              <input
                className="w-full border p-2 rounded"
                placeholder="File Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              <input
                className="w-full border p-2 rounded"
                placeholder="Link"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeEditModal} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded">
                Cancel
              </button>
              <button onClick={handleEditSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </Drawer>
        )}
      </div>
    </>
  );
};
