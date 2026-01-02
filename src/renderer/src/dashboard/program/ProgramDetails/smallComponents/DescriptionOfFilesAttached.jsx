import ReactQuill from 'react-quill-new';
import { Drawer } from '../../../../components/common/Drawer';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { SquarePen } from 'lucide-react';

export const DescriptionOfFilesAttached = ({ data }) => {
  const [formData, setFormData] = useState({
    leadDetailsSection: '',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const user = useSelector((state) => state.user.value);
  const authorisedUser = ['admin', 'superAdmin'].includes(user?.role);

  const openEditModal = () => {
    setFormData({ leadDetailsSection: data });
    setIsDrawerOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/campaigns/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error(err);
    }
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 p-5 lg:p-6  ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">File Description</h1>

          {authorisedUser && (
            <button onClick={openEditModal} className="text-blue-500 hover:text-blue-600">
              <SquarePen size={16} />
            </button>
          )}
        </div>

        {data ? (
          <div
            className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed wrap-break-word overflow-hidden"
            dangerouslySetInnerHTML={{ __html: data }}
          />
        ) : (
          <div className="flex items-center gap-3 py-2 text-gray-400 dark:text-gray-500">
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm italic">No description available for these files.</p>
          </div>
        )}
        {isDrawerOpen && (
          <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen} width="55%">
            <EditContentModal
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleEditSubmit}
              onClose={() => setIsDrawerOpen(false)}
            />
          </Drawer>
        )}
      </div>
    </>
  );
};
const EditContentModal = ({ onSubmit, formData, setFormData, onClose }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6">
      <h3 className="text-lg font-semibold mb-4">Edit Additional Information</h3>

      <form onSubmit={onSubmit} className="space-y-4">
        <ReactQuill
          value={formData.leadDetailsSection}
          onChange={(html) => setFormData({ leadDetailsSection: html })}
          theme="snow"
          className="min-h-50"
        />

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
