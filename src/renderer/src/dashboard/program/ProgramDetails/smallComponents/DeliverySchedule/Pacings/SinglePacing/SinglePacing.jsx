import { useMemo, useState } from 'react';
import { ArrowLeft, Download, Upload, Loader2, AlertCircle } from 'lucide-react';
import LeadsTable from './LeadsTable';
import UploadDrawer from './UploadDrawer';
import UploadRejections from './UploadRejections';
import { Drawer } from '../../../../../../../components/common/Drawer';
import * as XLSX from 'xlsx';
import { useFetchData } from '../../../../../../../hooks/useFetchData';

export default function SinglePacing({ pacingId, onBack }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUploadRejectionsDrawerOpen, setIsUploadRejectionsDrawerOpen] = useState(false);
  const [range, setRange] = useState({ start: 1, end: 0 });

  // 1. Fetch Validation Flags
  const {
    data: validationRes,
    loading: validationLoading,
    error: validationError,
  } = useFetchData(pacingId ? `/volumes/available-validations?pacingId=${pacingId}` : null);

  const {
    data: leadsRes,
    loading: leadsLoading,
    error: leadsError,
    refetch: refetchLeads,
  } = useFetchData(pacingId ? `/leads/pacing/${pacingId}` : null);

  console.log(pacingId, 'pacingId');

  console.log(leadsRes, 'leadsRes');
  const flags = validationRes?.data || {};
  const volumeName = flags.volumeName || 'Volume';
  const pacingDate = flags.pacingDate || '';

  const headers = leadsRes?.data?.headers || [];
  const leads = leadsRes?.data?.leads || [];

  useMemo(() => {
    if (leads.length > 0 && range.end === 0) {
      setRange((prev) => ({ ...prev, end: leads.length }));
    }
  }, [leads]);

  const handleExport = () => {
    if (!leads?.length) return alert('No leads available to export.');

    const start = Math.max(1, range.start);
    const end = Math.min(leads.length, range.end);

    if (start > end) return alert('Invalid range selected.');

    const selectedLeads = leads.slice(start - 1, end);

    const exportData = selectedLeads.map((lead) => {
      const row = {};
      headers.forEach(([key, label]) => {
        row[label] = lead.data?.[key] ?? lead[key] ?? '';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    const formattedDate = pacingDate ? pacingDate.slice(0, 10).replace(/:/g, '-') : 'export';
    XLSX.writeFile(workbook, `${volumeName}_${formattedDate}.xlsx`);
  };

  if (validationLoading || leadsLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Loading Pacing Data...</p>
      </div>
    );
  }

  if (validationError || leadsError) {
    return (
      <div className="p-10 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-bold">Error loading data</p>
        <button onClick={onBack} className="mt-4 text-blue-600 underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 border border-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Pacings
          </button>

          <div className="text-right">
            <h2 className="text-sm text-gray-500 uppercase tracking-wider font-bold">{volumeName}</h2>
            <h3 className="text-xl font-bold text-gray-900">{pacingDate.slice(0, 10)}</h3>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="flex gap-2">
            <button
              onClick={() => setIsUploadRejectionsDrawerOpen(true)}
              className="flex items-center bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded text-sm font-bold hover:bg-red-100 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" /> Rejections
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700  transition-all"
            >
              <Upload className="w-4 h-4 mr-2" /> Upload Leads
            </button>
          </div>

          <div className="flex items-center gap-3 bg-white p-1.5 px-3 rounded border border-gray-200 ">
            <span className="text-xs font-bold text-gray-500 uppercase">Export Range</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={range.start}
                onChange={(e) => setRange({ ...range, start: Number(e.target.value) })}
                className="border border-gray-200 rounded px-2 py-1 w-16 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                min="1"
                value={range.end}
                onChange={(e) => setRange({ ...range, end: Number(e.target.value) })}
                className="border border-gray-200 rounded px-2 py-1 w-16 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              onClick={handleExport}
              className="ml-2 flex items-center bg-emerald-600 text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-1.5" /> Export XLSX
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="mt-6 border border-gray-100 rounded-xl overflow-hidden">
          <LeadsTable headers={headers} leads={leads} />
        </div>
      </div>

      {/* Drawers */}
      <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen} width="60%">
        <UploadDrawer
          pacingId={pacingId}
          onSuccess={() => {
            setIsDrawerOpen(false);
            refetchLeads();
          }}
        />
      </Drawer>

      <Drawer open={isUploadRejectionsDrawerOpen} setOpen={setIsUploadRejectionsDrawerOpen} width="30%">
        <UploadRejections
          pacingId={pacingId}
          onSuccess={() => {
            setIsUploadRejectionsDrawerOpen(false);
            refetchLeads();
          }}
        />
      </Drawer>
    </div>
  );
}
