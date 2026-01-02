import { useState, useMemo, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useFetchData } from '../../../hooks/useFetchData';

import { Plus } from 'lucide-react';
import { Drawer } from '../../../components/common/Drawer';
import ProgramBuilder from '../../builders/CampaignBuilder/CampaignBuilder';
import ProgramTable from './ProgramTable/ProgramTable';

const adminTabs = [
  { id: 'New', key: 'new' },
  { id: 'Due Today', key: 'duetoday' },
  { id: 'Overdue', key: 'overdue' },
  { id: 'Upcoming', key: 'upcoming' },
  { id: 'Recently Update', key: 'recentupdate' },
  { id: 'Active', key: 'active' },
  { id: 'Completed', key: 'completed' },
  { id: 'Paused', key: 'paused' },
  { id: 'All', key: 'all' },
  { id: 'Retouch', key: 'retouch' },
];

const userTabs = [
  { id: 'New', key: 'new' },
  { id: 'Due Today', key: 'duetoday' },
  { id: 'Overdue', key: 'overdue' },
];

export default function ProgramTabs() {
  const user = useSelector((state) => state.user.value);
  const isAdmin = ['admin', 'superAdmin'].includes(user?.role);

  const TABS = useMemo(() => (isAdmin ? adminTabs : userTabs), [isAdmin]);

  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [filterName, setFilterName] = useState(TABS[0].key);
  const [pageNo, setPageNo] = useState(1);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    data: programsResponse,
    loading,
    error,
    refetch: refetchPrograms,
  } = useFetchData(`/campaigns?filter=${filterName}&page=${pageNo}`);

  const programs = programsResponse?.data || [];

  const { data: countResponse, refetch: refetchCounts } = useFetchData('/campaigns/counts');

  const counts = countResponse?.data || {};

  const totalPages = useMemo(() => {
    const count = Number(counts?.[filterName] || 0);
    return Math.ceil(count / 10) || 1;
  }, [counts, filterName]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab.id);
    setFilterName(tab.key);
    setPageNo(1);
  };

  useEffect(() => {
    refetchPrograms();
    refetchCounts();
  }, [filterName, pageNo, refreshTrigger]);
  const handleProgramSuccess = () => {
    setIsDrawerOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Program Queue</h2>
        {['admin', 'superAdmin'].includes(user.role) && (
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 rounded-lg border p-3 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <Plus size={14} /> Create Program
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b pb-3 dark:border-gray-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabSwitch(tab)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800'
            }`}
          >
            {activeTab === tab.id && (
              <Motion.div
                layoutId="active-pill-soft"
                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20"
                style={{ borderRadius: 9999 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.id}</span>

            {/* <span
              className={`ml-2 rounded-lg px-2 py-0.5 text-xs relative z-10 ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-zinc-800'
              }`}
            >
              {counts[tab.key] || 0}
            </span> */}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <ProgramTable tableData={programs} loading={loading} error={error} />
      </div>

      <div className="flex justify-end items-center mt-4 gap-2 text-sm">
        <button
          disabled={pageNo === 1}
          onClick={() => setPageNo((p) => p - 1)}
          className="border rounded px-2 py-1 disabled:opacity-50"
        >
          «
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPageNo(i + 1)}
            className={`px-2 py-1 border rounded ${
              pageNo === i + 1 ? 'bg-gray-300 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={pageNo === totalPages}
          onClick={() => setPageNo((p) => p + 1)}
          className="border rounded px-2 py-1 disabled:opacity-50"
        >
          »
        </button>
      </div>
      {isDrawerOpen && (
        <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen} width="60%">
          <ProgramBuilder onSuccess={handleProgramSuccess} />
        </Drawer>
      )}
    </div>
  );
}
