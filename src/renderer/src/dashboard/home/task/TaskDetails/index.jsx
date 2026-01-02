import { useParams, useLocation } from 'react-router-dom';
import { ClipboardList, User, BarChart3, MessageSquare, CheckCircle2, Timer, PauseCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { start } from '../../../../store/session/sessionSlice';
import BriefDetailPage from '../../../brief/BriefDetails/BriefDetailPage';
import ProgramDetailPage from '../../../program/ProgramDetails/ProgramDetailPage';
import PageMeta from '../../../../components/common/PageMeta';
import PageBreadcrumb from '../../../../components/common/PageBreadCrumb';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Task() {
  const user = useSelector((state) => state.user.value);
  const session = useSelector((state) => state.session.value);
  const { taskId } = useParams();
  const query = useQuery();
  const action = query.get('action');
  const [task, setTask] = useState(null);
  const [assignedBy, setAssignedBy] = useState('');
  const ranOnce = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!taskId || ranOnce.current) return;
    ranOnce.current = true;
    fetchData();
  }, [taskId]);

  useEffect(() => {
    if (task?.status === 'Not Started') {
      updateStatus('In Progress');
    }
  }, [task]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/tasks/user-tasks?userId=${user?.userId}&taskId=${taskId}`
      );

      const response = await res.json();
      const data = response?.data;

      if (!data) return;

      setAssignedBy(data?.assignee?.name || 'Unknown');
      setTask(data?.task || null);

      if (action === 'work' && data?.task) {
        if (session.id > -1) await stopSession(session.id);
        await startSession(user?.userId, taskId, data.task.name);
      }
    } catch (err) {
      console.error('Error fetching task:', err);
    }
  };

  const updateStatus = async (selectedStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          userId: user?.userId,
          status: selectedStatus,
        }),
      });

      if (res.ok) {
        setTask((prev) => ({ ...prev, status: selectedStatus }));
      } else {
        const errData = await res.json();
        console.error('Failed:', errData.message);
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const startSession = async (userId, taskId, name) => {
    try {
      if (name === session.taskName) return;

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          userId,
          date: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()),
          startTime: new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: false,
          }),
        }),
      });

      const data = await res.json();

      const now = new Date();
      const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
      const startTime = ist.toISOString().replace('Z', '+05:30');

      dispatch(
        start({
          id: data.sessionId,
          taskName: name,
          startTime,
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const stopSession = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/session/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endTime: new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: false,
          }),
        }),
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (!task) {
    return <p className="text-gray-600 dark:text-gray-300 text-center h-screen">Loading details...</p>;
  }

  // Helper for Status UI
  const statusOptions = [
    {
      label: 'In Progress',
      value: 'In Progress',
      color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20',
      icon: Timer,
    },
    {
      label: 'Paused',
      value: 'Paused',
      color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20',
      icon: PauseCircle,
    },
    {
      label: 'Completed',
      value: 'Completed',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20',
      icon: CheckCircle2,
    },
  ];

  // Helper for Level colors
  const levelColor =
    {
      High: 'text-red-600 bg-red-50 dark:bg-red-500/10',
      Medium: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10',
      Low: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10',
    }[task.level] || 'text-gray-600 bg-gray-50';

  return (
    // <>
    //   <PageMeta title="Task" description="This is Task page." />
    //   <PageBreadcrumb pageTitle="Task" />

    //   <div className="dark:bg-white/3">
    //     <div className="grid grid-cols-12 gap-4 md:gap-6">
    //       {/* Task Info Card */}
    //       <div className="col-span-6 xl:col-span-12">
    //         <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 lg:p-6">
    //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    //             {/* Type */}
    //             <div>
    //               <p className="text-gray-500 text-sm">Type</p>
    //               <p className="text-gray-800 dark:text-gray-200">{task.type}</p>
    //             </div>

    //             {/* Assigned By */}
    //             <div>
    //               <p className="text-gray-500 text-sm">Assigned By</p>
    //               <p className="text-gray-800 dark:text-gray-200">{assignedBy}</p>
    //             </div>

    //             {/* Status */}
    //             <div>
    //               <p className="text-gray-500 text-sm mb-1">Status</p>
    //               <div className="space-y-1">
    //                 {['In Progress', 'Paused', 'Completed'].map((s) => (
    //                   <label key={s} className="flex items-center gap-2 cursor-pointer">
    //                     <input
    //                       type="radio"
    //                       name="taskStatus"
    //                       value={s}
    //                       checked={task.status === s}
    //                       onChange={() => updateStatus(s)}
    //                       className="text-indigo-600 focus:ring-indigo-500"
    //                     />
    //                     <span className="text-gray-800 dark:text-gray-200 text-sm">{s}</span>
    //                   </label>
    //                 ))}
    //               </div>
    //             </div>

    //             {/* Level */}
    //             <div>
    //               <p className="text-gray-500 text-sm">Level</p>
    //               <p className="text-gray-800 dark:text-gray-200">{task.level}</p>
    //             </div>

    //             {/* Remark */}
    //             <div className="sm:col-span-2">
    //               <p className="text-gray-500 text-sm">Remark</p>
    //               <p className="text-gray-800 dark:text-gray-200">{task.remark || '—'}</p>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Campaign */}
    //       {task?.type === 'Campaign' && (
    //         <div className="col-span-12">
    //           <ProgramDetailPage programId={task.typeId} PageBreadcrumb={false} />
    //         </div>
    //       )}

    //       {/* Brief */}
    //       {task?.type === 'Breif' && (
    //         <div className="col-span-12">
    //           <BriefDetailPage briefId={task.typeId} PageBreadcrumb={false} />
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </>
    <>
      <PageMeta title={`Task: ${task.type}`} description="Detailed task view" />
      <PageBreadcrumb pageTitle="Task Detail" />

      <div className="space-y-6 px-4 sm:px-0">
        {/* Main Task Card */}
        <div className="rounded-2xl border border-gray-200 bg-white  dark:border-gray-800 dark:bg-white/3">
          {/* Card Header */}
          <div className="border-b border-gray-100 p-5 dark:border-gray-800 lg:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Task Information</h3>
                </div>
              </div>

              {/* Status Switcher (Segmented Control) */}
              <div className="flex bg-gray-50 p-1 rounded-xl dark:bg-gray-800/50">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateStatus(option.value)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-all rounded-lg ${
                      task.status === option.value
                        ? 'bg-white shadow-sm text-gray-900 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <option.icon size={14} className={task.status === option.value ? 'text-indigo-500' : ''} />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Assigned By */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <User size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Assigned By</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{assignedBy}</p>
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <BarChart3 size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Task Type</span>
                </div>
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {task.type}
                </span>
              </div>

              {/* Level */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Priority Level</span>
                </div>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${levelColor}`}>
                  {task.level}
                </span>
              </div>

              {/* Remark */}
              <div className="md:col-span-2 lg:col-span-4 mt-2 p-4 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                  <MessageSquare size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">Remark / Notes</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 italic">
                  {task.remark ? `"${task.remark}"` : 'No remarks provided for this task.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Detail Content */}
        <div className="transition-all duration-300">
          {/* {task?.type === 'Campaign' && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <ProgramDetailPage programId={task.typeId} PageBreadcrumb={false} />
            </div>
          )}

          {task?.type === 'Brief' && ( // Fixed typo from 'Breif'
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <BriefDetailPage briefId={task.typeId} PageBreadcrumb={false} />
            </div>
          )} */}

          {/* Campaign */}
          {task?.type === 'Campaign' && (
            <div className="col-span-12">
              <ProgramDetailPage programId={task.typeId} PageBreadcrumb={false} />
            </div>
          )}

          {/* Brief */}
          {task?.type === 'Breif' && (
            <div className="col-span-12">
              <BriefDetailPage briefId={task.typeId} PageBreadcrumb={false} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
