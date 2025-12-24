import { Coffee, Heart, UserCheck, Users } from 'lucide-react';
import { useFetchData } from '../../../hooks/useFetchData';

export default function Attendancesummary() {
  const { data, loading, error, refetch } = useFetchData('/leaves/summary/counts');

  const isLoadingOrInitialLoad = loading || !data;

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400 border border-red-200 rounded-lg">
        <p className="font-semibold mb-2">Error Loading Data</p>
        <p className="text-sm">{error}</p>
        <button onClick={refetch} className="mt-4 text-blue-500 hover:underline">
          Try Again
        </button>
      </div>
    );
  }

  if (isLoadingOrInitialLoad) {
    return <div className="p-10 text-center text-gray-500">Fetching data, please wait...</div>;
  }

  if (data?.totalEmployees === 0) {
    return (
      <div className="p-6 text-center text-gray-500 border border-gray-200 rounded-lg">
        <p className="text-lg font-semibold">No Data Found</p>
        <p className="text-sm">You currently have no attendance data.</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Present Today',
      value: data?.totalPresent ?? 0,
      subtext: `out of ${data?.totalEmployees ?? 0} employees`,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'On Casual Leave',
      value: data?.onCasualLeave ?? 0,
      subtext: '',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'On Sick Leave',
      value: data?.onSickLeave ?? 0,
      subtext: '',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'On Break',
      value: data?.onBreak ?? 0,
      subtext: 'Currently active',
      icon: Coffee,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div key={index} className="border rounded-2xl bg-white">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  {stat.subtext && <p className="text-xs text-gray-500">{stat.subtext}</p>}
                </div>

                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
