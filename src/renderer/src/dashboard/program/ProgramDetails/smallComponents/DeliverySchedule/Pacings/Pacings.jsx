// import { useEffect, useMemo, useState } from 'react';
// import { ArrowLeft, Calendar, ChartLine } from 'lucide-react';
// import SinglePacing from './SinglePacing/SinglePacing';

// const PACING_STATUS_MAP = {
//   scheduled: 'Scheduled',
//   Active: 'Active',
//   Completed: 'Completed',
// };

// const STATUS_COLORS = {
//   Scheduled:
//     'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-200 dark:border-yellow-800',
//   Active: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800',
//   Completed:
//     'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800',
// };

// const Pacings = ({ volumeId, onBack }) => {
//   const [pacings, setPacings] = useState([]);
//   const [volumeName, setVolumeName] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedPacingId, setSelectedPacingId] = useState(null);
//   useEffect(() => {
//     const fetchPacings = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           `${import.meta.env.VITE_BASE_URL}/pacings/volume/${volumeId}`
//           // { headers: { Authorization: `Bearer ${user.token}` } },
//         );
//         if (!response.ok) throw new Error('Failed to fetch pacings');
//         const res = await response.json();
//         setVolumeName(res.data.name);
//         setPacings(res.data.pacings || []);
//       } catch (e) {
//         console.error('Fetch pacings error:', e);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPacings();
//   }, [volumeId]);
//   const groupedPacings = useMemo(() => {
//     const groups = { Scheduled: [], Active: [], Completed: [] };
//     pacings.forEach((pacing) => {
//       const status = PACING_STATUS_MAP[pacing.status] || 'Scheduled';
//       groups[status].push(pacing);
//     });
//     return groups;
//   }, [pacings]);

//   if (isLoading) {
//     return (
//       <div className="p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
//           <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
//           <div className="grid gap-4 md:grid-cols-3">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (selectedPacingId) {
//     return (
//       <SinglePacing
//         pacingId={selectedPacingId}
//         onBack={() => {
//           setSelectedPacingId(null);
//         }}
//       />
//     );
//   }

//   return (
//     <>
//       {/* {PageBreadcrumb && (
//         <>
//           <PageMeta title="Pacings" description="This is Pacings page." />
//           <PageBreadcrumb pageTitle="Pacings" />
//         </>
//       )} */}

//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6 space-y-8">
//         <button>
//           <h1
//             onClick={() => {
//               onBack();
//             }}
//             className="flex items-center px-3 py-1.5 text-sm rounded-md text-gray-600 hover:bg-gray-100"
//           >
//             <ArrowLeft className="mr-2" /> Back
//           </h1>
//         </button>

//         {/* STATUS GROUP BLOCKS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//           {Object.entries(groupedPacings).map(([status, pacingList]) => (
//             <div key={status} className="flex flex-col">
//               <div
//                 className={`flex items-center justify-between px-3 py-2 rounded-t-md text-sm font-medium ${STATUS_COLORS[status]}`}
//               >
//                 <span>{status}</span>
//                 <span className="font-semibold">{pacingList.length}</span>
//               </div>

//               <div className="min-h-45 border border-gray-200 dark:border-gray-700 rounded-b-md p-3">
//                 {pacingList.length === 0 ? (
//                   <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-gray-500">
//                     No pacings
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {pacingList.map((pacing) => {
//                       const completed = pacing.actualLeads;
//                       const goal = pacing.leadGoal;
//                       const pending = Math.max(0, goal - completed);
//                       const progressPercentage = Math.round(Math.min(100, (completed / goal) * 100));

//                       return (
//                         <div
//                           onClick={() => setSelectedPacingId(pacing.id)}
//                           key={pacing.id}
//                           className="block cursor-pointer"
//                         >
//                           <div className="p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700  transition">
//                             <div className="flex items-center mb-2">
//                               <Calendar className="text-gray-400 mr-2 text-xs" />
//                               <span className="text-sm font-medium text-gray-900 dark:text-white">
//                                 {new Date(pacing.scheduledFor).toLocaleDateString('en-US', {
//                                   weekday: 'short',
//                                   month: 'short',
//                                   day: 'numeric',
//                                 })}
//                               </span>
//                             </div>

//                             <div className="mt-2">
//                               <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
//                                 <span>Goal: {goal}</span>
//                                 <span>Pending: {pending}</span>
//                               </div>

//                               <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
//                                 <div
//                                   className="h-2 rounded-full"
//                                   style={{
//                                     width: `${progressPercentage}%`,
//                                     backgroundColor:
//                                       status === 'Completed' ? '#10B981' : status === 'Active' ? '#3B82F6' : '#F59E0B',
//                                   }}
//                                 />
//                               </div>

//                               <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
//                                 <span>Completed: {completed}</span>
//                                 <span>{progressPercentage}%</span>
//                               </div>
//                             </div>

//                             <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
//                               <span className="text-xs text-gray-400 dark:text-gray-500">View Details</span>
//                               <ChartLine className="text-gray-400 text-xs" />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Pacings;
import { useMemo, useState } from 'react';
import { ArrowLeft, Calendar, ChevronRight, Loader2, Inbox } from 'lucide-react';
import SinglePacing from './SinglePacing/SinglePacing';
import { useFetchData } from '../../../../../../hooks/useFetchData';
import toast from 'react-hot-toast';

const PACING_STATUS_MAP = {
  scheduled: 'Scheduled',
  Active: 'Active',
  Completed: 'Completed',
};

const STATUS_THEMES = {
  Scheduled: {
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/50',
    bar: '#F59E0B',
  },
  Active: {
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/50',
    bar: '#3B82F6',
  },
  Completed: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    bar: '#10B981',
  },
};

const Pacings = ({ volumeId, onBack }) => {
  const [selectedPacingId, setSelectedPacingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const API_URL = volumeId ? `/pacings/volume/${volumeId}` : null;
  const { data, loading, error, refetch } = useFetchData(API_URL);

  const pacings = data?.data?.pacings || [];

  const handleStatusUpdate = async (e, pacingId, newStatus) => {
    e.stopPropagation();
    setUpdatingId(pacingId);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/pacings/${pacingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success(`Pacing marked as ${newStatus}`);
      refetch();
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const groupedPacings = useMemo(() => {
    const groups = { Scheduled: [], Active: [], Completed: [] };

    // Sort by date before grouping
    const sortedPacings = [...pacings].sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));

    sortedPacings.forEach((pacing) => {
      const status = PACING_STATUS_MAP[pacing.status] || 'Scheduled';
      if (groups[status]) groups[status].push(pacing);
    });
    return groups;
  }, [pacings]);

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-gray-500 font-medium">Fetching delivery pacings...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-medium">Error loading pacings. Please try again.</p>
        <button onClick={() => refetch()} className="mt-4 text-sm text-red-700 underline">
          Retry
        </button>
      </div>
    );
  }

  if (selectedPacingId) {
    return <SinglePacing pacingId={selectedPacingId} onBack={() => setSelectedPacingId(null)} />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white dark:bg-gray-950 p-5 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <button
            onClick={onBack}
            className="w-fit flex items-center px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Volumes
          </button>

          <div className="sm:text-right">
            <h2 className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">Delivery Pacings</h2>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {data?.data?.name || 'Volume Pacings'}
            </h3>
          </div>
        </div>

        {pacings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Inbox className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">No pacing schedules found for this volume.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(groupedPacings).map(([status, pacingList]) => (
              <div key={status} className="flex flex-col gap-4">
                {/* Status Column Header */}
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border ${STATUS_THEMES[status].border} ${STATUS_THEMES[status].bg}`}
                >
                  <span className={`text-xs font-black uppercase tracking-widest ${STATUS_THEMES[status].text}`}>
                    {status}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-lg bg-white dark:bg-gray-900 shadow-sm ${STATUS_THEMES[status].text}`}
                  >
                    {pacingList.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-4">
                  {pacingList.map((pacing) => {
                    const completed = pacing.actualLeads || 0;
                    const goal = pacing.leadGoal || 1;
                    const progressPercentage = Math.round(Math.min(100, (completed / goal) * 100));
                    const isThisUpdating = updatingId === pacing.id;

                    return (
                      <div
                        key={pacing.id}
                        onClick={() => setSelectedPacingId(pacing.id)}
                        className="group relative bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-900 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-5">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${STATUS_THEMES[status].bg}`}>
                              <Calendar className={`w-4 h-4 ${STATUS_THEMES[status].text}`} />
                            </div>
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                              {new Date(pacing.scheduledFor).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          <div className="relative">
                            {isThisUpdating ? (
                              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                            ) : (
                              <select
                                value={pacing.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleStatusUpdate(e, pacing.id, e.target.value)}
                                className="text-[10px] font-black uppercase py-1.5 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                              >
                                <option value="scheduled">Scheduled</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                              </select>
                            )}
                          </div>
                        </div>

                        {/* Progress Section */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Progress</p>
                              <p className="text-lg font-black text-gray-900 dark:text-white">
                                {completed} <span className="text-xs font-medium text-gray-400">/ {goal} Leads</span>
                              </p>
                            </div>
                            <span className={`text-sm font-black ${STATUS_THEMES[status].text}`}>
                              {progressPercentage}%
                            </span>
                          </div>

                          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${progressPercentage}%`, backgroundColor: STATUS_THEMES[status].bar }}
                            />
                          </div>

                          <div className="flex items-center justify-end text-[10px] font-black text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            VIEW DETAILS <ChevronRight className="w-3 h-3 ml-1" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pacings;
