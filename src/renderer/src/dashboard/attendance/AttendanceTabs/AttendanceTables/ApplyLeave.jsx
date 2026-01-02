import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion as Motion } from 'framer-motion';

export default function ApplyLeave({ userId }) {
  const user = useSelector((state) => state.user.value);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [duration, setDuration] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleClearForm = () => {
    setLeaveType('');
    setFromDate('');
    setToDate('');
    setDuration('');
    setReason('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!leaveType || !fromDate || !toDate || !duration || !reason) {
      setMessage('❌ Please fill in all fields.');
      setLoading(false);
      return;
    }

    const applicantId = userId || user?.userId;
    if (!applicantId) {
      setMessage('❌ User ID is missing. Cannot submit request.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/leaves/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: applicantId,
          leaveType,
          fromDate,
          toDate,
          duration,
          reason,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage('✅ Leave application submitted successfully!');
        handleClearForm();
      } else {
        setMessage(result.message || '❌ Failed to submit leave application. Please try again.');
      }
    } catch (error) {
      console.error('Error applying for leave:', error);
      setMessage('⚠️ Error submitting leave request. Check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const messageType = message.startsWith('✅') ? 'success' : message.startsWith('❌') ? 'error' : 'warning';

  const getMessageStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-700';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const inputBaseClasses =
    'w-full border border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-lg px-4 py-2.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const labelBaseClasses = 'text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <div className="pt-3 pb-6">
      {message && (
        <Motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${getMessageStyles(messageType)} flex items-start`}
        >
          <span className="shrink-0 mr-3 mt-0.5">
            {message.startsWith('✅') ? '🎉' : message.startsWith('❌') ? '🚨' : '⚠️'}
          </span>
          <p className="grow">{message}</p>
        </Motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelBaseClasses}>Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
              className={inputBaseClasses}
            >
              <option value="" className="dark:text-gray-400">
                Select leave type
              </option>
              <option value="CASUAL">Casual Leave</option>
              <option value="SICK">Sick Leave</option>
              <option value="EARNED">Earned Leave</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelBaseClasses}>Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className={inputBaseClasses}
            >
              <option value="" className="dark:text-gray-400">
                Select duration
              </option>
              <option value="FULL_DAY">Full Day (1 day)</option>
              <option value="MULTI_DAY">Multiple Days</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelBaseClasses}>From Date</label>
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className={inputBaseClasses + ' appearance-none'}
              />
              {/* <CalendarIcon className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" /> */}
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelBaseClasses}>To Date</label>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className={inputBaseClasses + ' appearance-none'}
              />
              {/* <CalendarIcon className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" /> */}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelBaseClasses}>Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            placeholder="Please provide a detailed reason for your leave request..."
            rows={4}
            className={inputBaseClasses + ' resize-none'}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-blue-600 text-white px-6 py-2.5 rounded font-normal shadow-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>Submit Request</>
            )}
          </button>
          <button
            type="button"
            onClick={handleClearForm}
            className="flex items-center justify-center border border-gray-300 dark:border-zinc-700 dark:text-gray-300 px-6 py-2.5 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors duration-200"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
