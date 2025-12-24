import { Check, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import Select from 'react-select';

const PRIORITY_MAP = {
  1: {
    label: 'Very Low',
    color: 'bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-700 dark:border-slate-500 dark:text-slate-200',
  },
  2: {
    label: 'Low',
    color: 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-700 dark:border-blue-400 dark:text-blue-200',
  },
  3: {
    label: 'Medium',
    color:
      'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-700 dark:border-yellow-400 dark:text-yellow-200',
  },
  4: {
    label: 'High',
    color:
      'bg-orange-100 border-orange-300 text-orange-700 dark:bg-orange-700 dark:border-orange-400 dark:text-orange-200',
  },
  5: {
    label: 'Critical',
    color: 'bg-red-100 border-red-300 text-red-700 dark:bg-red-700 dark:border-red-400 dark:text-red-200',
  },
};
export default function AddNotification({ showAddModal, addNotificationToggler, token }) {
  const [subscriberGroupNames, setSubscriberGroupNames] = useState([]);
  const [createSubGroup, setCreateGroup] = useState(false);
  const [users, setUsers] = useState([]);
  const [priority, setPriority] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [groupName, setGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const notificationToggler = (action) => {
    addNotificationToggler(action);
    if (!action) resetForm();
  };

  const resetForm = () => {
    setPriority('');
    setSelectedGroups([]);
    setMessage('');
    setCreateGroup(false);
    setGroupName('');
    setSelectedUsers([]);
    setFormErrors({});
    setSuccessMessage('');
  };

  const validate = () => {
    const errors = {};
    if (!message.trim()) errors.message = 'Message is required';
    if (!priority) errors.priority = 'Priority is required';
    if (selectedGroups.length === 0 && !createSubGroup) errors.groups = 'At least one group is required';
    if (createSubGroup && !groupName.trim()) errors.groupName = 'Group name is required';
    if (createSubGroup && selectedUsers.length === 0) errors.groupUsers = 'At least one user is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addNotification = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const newData = {
        message,
        groupIds: [...selectedGroups],
        priorityId: parseInt(priority),
      };
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newData),
      });
      if (!response.ok) throw new Error('Failed to add notification');
      setSuccessMessage('Notification added successfully!');
      setTimeout(() => notificationToggler(false), 1500);
    } catch (error) {
      setFormErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSubGroup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const data = { name: groupName, users: selectedUsers };
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications/notification-subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create group');

      const res = await response.json();
      setSubscriberGroupNames((prev) => [...prev, res]);
      setSelectedGroups((prev) => [...prev, res.id]);
      setGroupName('');
      setSelectedUsers([]);
      setCreateGroup(false);
    } catch (error) {
      setFormErrors({ submit: error.message });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('User fetch failed');
      setUsers(await response.json());
    } catch {
      setFormErrors({ submit: 'Failed to load users' });
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/notifications/notification-subscribers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Group fetch failed');
      setSubscriberGroupNames(await response.json());
    } catch {
      setFormErrors({ submit: 'Failed to load groups' });
    }
  };

  useEffect(() => {
    if (showAddModal) fetchGroups();
  }, [showAddModal]);

  const userOptions = users.map((u) => ({ value: u.id, label: u.name }));
  const groupOptions = subscriberGroupNames.map((g) => ({
    value: g.id,
    label: g.name,
  }));

  return (
    <form className="p-5 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Message *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className={`w-full rounded-lg border p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 ${
            formErrors.message ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Enter notification message..."
        />
        {formErrors.message && <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>}
      </div>

      {/* Priority Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Priority Level *</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((level) => {
            const { label, color } = PRIORITY_MAP[level];
            return (
              <button
                key={level}
                type="button"
                onClick={() => setPriority(level)}
                className={`py-2.5 rounded-lg text-sm font-medium text-center border ${
                  priority === level
                    ? `${color} ring-2 ring-offset-1 ring-blue-300`
                    : 'border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {formErrors.priority && <p className="mt-1 text-sm text-red-600">{formErrors.priority}</p>}
      </div>

      {/* Groups Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-5 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Subscriber Groups *</label>
          <button
            type="button"
            onClick={() => {
              setCreateGroup(!createSubGroup);
              if (!createSubGroup) fetchUsers();
            }}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
          >
            {createSubGroup ? 'Cancel Group' : 'Create New Group'}
          </button>
        </div>

        {createSubGroup && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-4">
            <h3 className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Users size={16} /> Create New Group
            </h3>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Group Name *</label>
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className={`w-full rounded-lg border p-2.5 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 ${
                  formErrors.groupName ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Marketing Team"
              />
              {formErrors.groupName && <p className="mt-1 text-sm text-red-600">{formErrors.groupName}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Select Users *</label>
              <Select
                isMulti
                options={userOptions}
                placeholder="Search users..."
                onChange={(selected) => setSelectedUsers(selected.map((u) => u.value))}
                className="text-sm"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: formErrors.groupUsers ? '#f87171' : '#d1d5db',
                    minHeight: '44px',
                    '&:hover': {
                      borderColor: formErrors.groupUsers ? '#f87171' : '#9ca3af',
                    },
                    backgroundColor: '#fff',
                  }),
                }}
              />
              {formErrors.groupUsers && <p className="mt-1 text-sm text-red-600">{formErrors.groupUsers}</p>}
            </div>

            <button
              onClick={addSubGroup}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg"
            >
              <Check size={16} /> Create Group
            </button>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Select existing groups</label>
          <Select
            isMulti
            options={groupOptions}
            value={groupOptions.filter((opt) => selectedGroups.includes(opt.value))}
            onChange={(selected) => setSelectedGroups(selected.map((g) => g.value))}
            className="text-sm"
            classNamePrefix="react-select"
            placeholder="Select groups..."
          />
          {formErrors.groups && !createSubGroup && <p className="mt-1 text-sm text-red-600">{formErrors.groups}</p>}
        </div>
      </div>

      {formErrors.submit && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 p-3 rounded-lg text-sm">{formErrors.submit}</div>
      )}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-600 p-3 rounded-lg text-sm">{successMessage}</div>
      )}

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => notificationToggler(false)}
          className="px-5 py-2.5 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={addNotification}
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg flex items-center gap-2"
        >
          {isSubmitting ? 'Creating...' : 'Create Notification'}
        </button>
      </div>
    </form>
  );
}
