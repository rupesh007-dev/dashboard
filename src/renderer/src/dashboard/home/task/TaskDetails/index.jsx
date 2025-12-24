import { useParams, useLocation } from 'react-router-dom';

import { useEffect, useRef, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { start } from '../../../../store/session/sessionSlice';
import BriefDetailPage from '../../../brief/BriefDetails/BriefDetailPage';
import ProgramDetailPage from '../../../program/ProgramDetails/ProgramDetailPage';
import PageMeta from '../../../../components/common/PageMeta';
import PageBreadcrumb from '../../../../components/common/PageBreadcrumb';

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
    } catch (e) {}
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
    } catch (e) {}
  };

  if (!task) {
    return <p className="text-gray-600 dark:text-gray-300 text-center h-screen">Loading details...</p>;
  }

  return (
    <>
      <PageMeta title="Task" description="This is Task page." />
      <PageBreadcrumb pageTitle="Task" />

      <div className="dark:bg-white/3">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Task Info Card */}
          <div className="col-span-6 xl:col-span-12">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/5 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Type */}
                <div>
                  <p className="text-gray-500 text-sm">Type</p>
                  <p className="text-gray-800 dark:text-gray-200">{task.type}</p>
                </div>

                {/* Assigned By */}
                <div>
                  <p className="text-gray-500 text-sm">Assigned By</p>
                  <p className="text-gray-800 dark:text-gray-200">{assignedBy}</p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-gray-500 text-sm mb-1">Status</p>
                  <div className="space-y-1">
                    {['In Progress', 'Paused', 'Completed'].map((s) => (
                      <label key={s} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="taskStatus"
                          value={s}
                          checked={task.status === s}
                          onChange={() => updateStatus(s)}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-gray-800 dark:text-gray-200 text-sm">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Level */}
                <div>
                  <p className="text-gray-500 text-sm">Level</p>
                  <p className="text-gray-800 dark:text-gray-200">{task.level}</p>
                </div>

                {/* Remark */}
                <div className="sm:col-span-2">
                  <p className="text-gray-500 text-sm">Remark</p>
                  <p className="text-gray-800 dark:text-gray-200">{task.remark || '—'}</p>
                </div>
              </div>
            </div>
          </div>

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
