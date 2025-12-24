import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { stop } from '../../store/session/sessionSlice';

export default function SessionBox() {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session.value);
  const [elapsed, setElapsed] = useState('00:00:00');

  const toISTDate = (timestamp) => {
    return new Date(new Date(timestamp).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  };

  useEffect(() => {
    if (session?.id === -1 || !session.startTime) return;

    const startDate = toISTDate(session.startTime);

    const interval = setInterval(() => {
      const diff = Date.now() - startDate.getTime();
      const hrs = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const mins = String(Math.floor((diff / 60000) % 60)).padStart(2, '0');
      const secs = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
      setElapsed(`${hrs}:${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const handleStop = async () => {
    if (session.id > -1) {
      await stopSession(session.id);
      dispatch(stop());
    }
  };

  const stopSession = async (id) => {
    try {
      const nowIST = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
      });

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/session/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endTime: nowIST }),
      });

      if (res.ok) {
        const endSessionRes = await res.json();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatISTTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      // second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  };

  return (
    <div className="flex items-center justify-between px-2 py-2   border rounded  text-sm">
      {session?.id !== -1 ? (
        <>
          <div className="flex items-center gap-3">
            <div className="font-medium text-gray-800">{session.taskName}</div>

            <span className="text-gray-400">|</span>

            <div className="text-gray-600">{session.startTime ? formatISTTime(session.startTime) : '00:00:00'}</div>

            <span className="text-gray-400">|</span>

            <div className="font-mono text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-lg">{elapsed}</div>
          </div>

          <button
            onClick={handleStop}
            className="px-2.5 py-1 text-white bg-red-500 hover:bg-red-600 active:scale-95 transition rounded text-xs"
          >
            Stop
          </button>
        </>
      ) : (
        <span className="text-gray-500">No Active Session</span>
      )}
    </div>
  );
}
