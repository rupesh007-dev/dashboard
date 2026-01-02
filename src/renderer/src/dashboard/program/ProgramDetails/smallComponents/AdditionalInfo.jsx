import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Drawer } from '../../../../components/common/Drawer';
import ReactQuill from 'react-quill-new';

export const AdditionalInfo = ({ data }) => {
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
      {/* <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Additional Information</h4>
      </div> */}

      <div className="bg-white  dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 text-sm space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Additional Information</h1>

          {authorisedUser && (
            <button onClick={openEditModal} className="text-blue-500 hover:text-blue-600">
              <SquarePen size={16} />
            </button>
          )}
        </div>
        <div dangerouslySetInnerHTML={{ __html: data }} />

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
    <div>
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
