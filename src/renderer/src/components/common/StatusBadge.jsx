export const StatusBadge = ({ status = '' }) => {
  const normalized = status.trim().toLowerCase();

  const getStatusStyles = () => {
    switch (normalized) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'paused':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'very urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'not started':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'new':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Low':
        return 'bg-green-100 text-green-400 border-green-200';
      case 'Med':
        return 'bg-green-100 text-green-500 border-green-200';
      case 'High':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'Urgent':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {status}
    </span>
  );
};
