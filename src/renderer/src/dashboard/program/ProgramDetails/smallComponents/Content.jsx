import { FolderPlus, SquarePen, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Drawer } from '../../../../components/common/Drawer';
import { FormatDate } from '../../../../components/common/FormatDate';

const ContentForm = ({ onSubmit, onClose, formData, setFormData, submitLabel }) => (
  <form onSubmit={onSubmit} className="space-y-4 p-4">
    {submitLabel === 'Add Content' && (
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
      </div>
    )}

    <div>
      <label className="block text-sm font-medium mb-1">Title</label>
      <input
        type="text"
        className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Opt-in Type</label>
        <input
          type="text"
          className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
          value={formData.optinType}
          onChange={(e) => setFormData({ ...formData, optinType: e.target.value })}
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Approval Date</label>
      <input
        type="date"
        className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600"
        value={formData.approveDate}
        onChange={(e) => setFormData({ ...formData, approveDate: e.target.value })}
      />
    </div>

    <div className="flex justify-end gap-3 pt-6">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 transition-colors"
      >
        Cancel
      </button>
      <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
        {submitLabel}
      </button>
    </div>
  </form>
);

export const Content = ({ data, programId }) => {
  const [categories, setCategories] = useState(data || []);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    type: '',
    approveDate: '',
    optinType: '',
    category: '',
  });

  useEffect(() => {
    setCategories(data || []);
  }, [data]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const newContent = { ...formData, id: Date.now().toString() };

    setCategories((prev) => {
      const existingCatIndex = prev.findIndex((c) => c.categoryName === newContent.category);

      if (existingCatIndex > -1) {
        const updated = [...prev];
        updated[existingCatIndex] = {
          ...updated[existingCatIndex],
          content: [...updated[existingCatIndex].content, newContent],
        };
        return updated;
      } else {
        return [...prev, { categoryName: newContent.category, content: [newContent] }];
      }
    });

    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/campaigns/${programId}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
      });
    } catch (err) {
      console.error('Failed to add content:', err);
    }
    setShowAdd(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        content: cat.content.map((item) => (item.id === formData.id ? { ...item, ...formData } : item)),
      }))
    );

    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/campaigns/${programId}/content?contentId=${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error('Failed to edit content:', err);
    }
    setShowEdit(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setCategories(
      (prev) =>
        prev
          .map((cat) =>
            cat.categoryName === deleteTarget.categoryName
              ? { ...cat, content: cat.content.filter((c) => c.id !== deleteTarget.id) }
              : cat
          )
          .filter((cat) => cat.content.length > 0) // Remove empty categories
    );

    try {
      await fetch(
        `${import.meta.env.VITE_BASE_URL}/campaigns/${programId}/content?contentId=${deleteTarget.id}&category=${deleteTarget.categoryName}`,
        { method: 'DELETE' }
      );
    } catch (err) {
      console.error('Failed to delete content:', err);
    }
    setDeleteTarget(null);
  };

  const openAddModal = () => {
    setFormData({ id: '', title: '', type: '', approveDate: '', optinType: '', category: '' });
    setShowAdd(true);
  };

  const openEditModal = (content, categoryName) => {
    setFormData({
      id: content.id,
      title: content.title || '',
      type: content.type || '',
      optinType: content.optinType || '',
      approveDate: content.approveDate ? content.approveDate.split('T')[0] : '',
      category: categoryName,
    });
    setShowEdit(true);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Content</h4>
        <button
          onClick={openAddModal}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FolderPlus size={20} />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 space-y-6 text-sm">
        {categories.length === 0 && <p className="text-gray-500 italic">No content available.</p>}
        {categories?.map((category, index) => (
          <div key={index}>
            <p className="font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wider text-xs">
              {category.categoryName}
            </p>
            <ol className="ml-2 space-y-3">
              {category?.content?.map((item, index) => (
                <li key={index} className="flex justify-between items-start group">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">{item.title}</span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.type} • {item.optinType} • Approved: {FormatDate(item.approveDate)}
                    </div>
                  </div>
                  <div className="flex gap-1 ml-3  transition-opacity">
                    <button
                      onClick={() => openEditModal(item, category.categoryName)}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <SquarePen size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ ...item, categoryName: category.categoryName })}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}

        <Drawer open={showAdd} setOpen={setShowAdd} width="40%">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold">Add New Content</h3>
          </div>
          <ContentForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleAddSubmit}
            onClose={() => setShowAdd(false)}
            submitLabel="Add Content"
          />
        </Drawer>

        <Drawer open={showEdit} setOpen={setShowEdit} width="40%">
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold">Edit Content</h3>
          </div>
          <ContentForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditSubmit}
            onClose={() => setShowEdit(false)}
            submitLabel="Save Changes"
          />
        </Drawer>

        <AnimatePresence>
          {deleteTarget && (
            <Motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Motion.div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm text-center"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Delete <span className="font-bold text-red-500">"{deleteTarget.title}"</span>?
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button onClick={confirmDelete} className="px-4 py-2 rounded bg-red-600 text-white font-medium">
                    Delete
                  </button>
                </div>
              </Motion.div>
            </Motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
