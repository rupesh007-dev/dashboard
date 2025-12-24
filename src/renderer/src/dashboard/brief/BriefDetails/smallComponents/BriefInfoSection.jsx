import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Drawer } from '../../../../components/common/Drawer';
import { FormatDate } from '../../../../components/common/FormatDate';

export default function BriefInfoSection({ data, briefId }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const user = useSelector((state) => state.user.value);
  const authorisedUser = ['admin', 'superAdmin'].includes(user?.role);

  const openEditDrawer = () => {
    setFormData({ ...data });
    setIsDrawerOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/briefs/${briefId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.error(err);
    }
    setIsDrawerOpen(false);
  };

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const displayValue = (value) => value || '-';
  const truncate = (str = '', len = 40) => (str.length > len ? `${str.slice(0, len)}...` : str);

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-800 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Basic Information</h2>

          {authorisedUser && (
            <button onClick={openEditDrawer} className="text-blue-600 hover:text-blue-700">
              <SquarePen size={16} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="Arrived On" value={FormatDate(data.arrivedOn)} />
          <Info label="Arrived On Time" value={displayValue(data.arrivedOnTime)} />
          <Info label="Due Date" value={FormatDate(data.due)} />
          <Info label="Due Time" value={displayValue(data.dueTime)} />
          <Info label="Status" value={displayValue(data.status)} />
          <Info label="Type" value={displayValue(data.type)} />
          <Info label="Remark" value={displayValue(data.remark)} />
          <Info label="Brief Hyperlink" value={displayValue(truncate(data?.briefHyperlink, 20))} />
        </div>

        {data?.files?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Files</p>
            <ul className="space-y-1">
              {data.files.map((file, i) => (
                <li key={i} className="text-sm">
                  <a
                    href={file.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {truncate(file.name, 50)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isDrawerOpen && formData && (
        <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen} width="50%">
          <EditContentModal
            formData={formData}
            onChange={updateField}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsDrawerOpen(false)}
          />
        </Drawer>
      )}
    </>
  );
}
const Info = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 dark:text-gray-400">{label}</span>
    <span className="font-medium text-gray-800 dark:text-gray-200">{value}</span>
  </div>
);

const formatDate = (date) => (date ? new Date(date).toLocaleString() : '-');

const Input = ({ label, type = 'text', value, onChange }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>

      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-700
                   bg-white dark:bg-gray-800
                   px-3 py-2 text-sm
                   text-gray-800 dark:text-gray-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
const Select = ({ label, value, options = [], onChange }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</label>

      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 dark:border-gray-700
                   bg-white dark:bg-gray-800
                   px-3 py-2 text-sm
                   text-gray-800 dark:text-gray-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select {label}
        </option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

const EditContentModal = ({ formData, onChange, onSubmit, onCancel }) => {
  return (
    <div className="bg-white dark:bg-gray-900 p-6">
      <h3 className="text-lg font-semibold mb-6">Edit Brief</h3>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Name" value={formData.name} onChange={(v) => onChange('name', v)} />
          <Input
            label="Arrived On"
            type="datetime-local"
            value={formData.arrivedOn}
            onChange={(v) => onChange('arrivedOn', v)}
          />
          <Input
            label="Arrived On Time"
            value={formData.arrivedOnTime}
            onChange={(v) => onChange('arrivedOnTime', v)}
          />
          <Input label="Due Date" type="date" value={formData.due} onChange={(v) => onChange('due', v)} />
          <Input label="Due Time" type="time" value={formData.dueTime} onChange={(v) => onChange('dueTime', v)} />

          <Select
            label="Status"
            value={formData.status}
            options={['New', 'InProgress', 'Quoted', 'NewUpdate']}
            onChange={(v) => onChange('status', v)}
          />

          <Input label="Type" value={formData.type} onChange={(v) => onChange('type', v)} />
          <Input label="Remark" value={formData.remark} onChange={(v) => onChange('remark', v)} />
          <Input
            label="Brief Hyperlink"
            value={formData.briefHyperlink}
            onChange={(v) => onChange('briefHyperlink', v)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
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
