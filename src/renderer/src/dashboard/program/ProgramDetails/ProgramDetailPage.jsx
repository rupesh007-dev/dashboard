import { ChevronRight, Clock } from 'lucide-react';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import 'jsuites/dist/jsuites.css';
import { Link } from 'react-router-dom';
import { useFetchData } from '../../../hooks/useFetchData';
import { LeadTotals } from './smallComponents/LeadTotals';
import { FilesAttached } from './smallComponents/FilesAttached';
import { Content } from './smallComponents/Content';
import { AdditionalInfo } from './smallComponents/AdditionalInfo';
import { UploadDeliverySection } from './smallComponents/UploadDeliverySection';
import { UploadTable } from './smallComponents/UploadTable';
import { DescriptionOfFilesAttached } from './smallComponents/DescriptionOfFilesAttached';
import { ProgramStatus } from './smallComponents/ProgramStatus';
import { Activity } from './smallComponents/Activity';
import { DeliverySchedule } from './smallComponents/DeliverySchedule/DeliverySchedule';

const ProgramDetailPage = ({ programId, PageBreadcrumb }) => {
  const API_URL = programId ? `/campaigns/${programId}` : null;

  const { data, loading, error, refetch } = useFetchData(API_URL);

  const programData = data?.data || [];

  console.log(programData, 'programData');
  if (error) {
    return (
      <div className="p-6 text-center text-red-600 dark:text-red-400 border border-red-200 rounded-lg">
        <p className="font-semibold mb-2">Error Loading data</p>
        <p className="text-sm">{error}</p>
        <button onClick={refetch} className="mt-4 text-blue-500 hover:underline">
          Try Again
        </button>
      </div>
    );
  }

  const isLoadingOrInitialLoad = loading || !data;

  if (!isLoadingOrInitialLoad && programData.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400 border border-gray-200 rounded-lg">
        <p className="text-lg font-semibold">No data Found</p>
        <p className="text-sm">You currently have no data.</p>
      </div>
    );
  }

  return (
    <div className=" dark:bg-gray-900 min-h-screen">
      {PageBreadcrumb && (
        <div className="flex justify-between items-center mb-8 p-4 lg:p-0">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Link to="/programs" className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              Programs <ChevronRight size={20} strokeWidth={1} />
            </Link>

            <span className="font-medium text-gray-700 dark:text-gray-300">{programData.name} </span>
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-normal mb-2 text-gray-900 dark:text-white">{programData.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Total Leads:
            <span className="font-semibold text-gray-700 dark:text-gray-300">{programData?.leadgoal}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Last Updated: {new Date(programData.arrivedOn).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6  ">
        <div className="col-span-12 xl:col-span-9 space-y-4  ">
          <LeadTotals data={programData} />
          <DeliverySchedule data={programData.volumes} files={programData.filesInfo} />
          <FilesAttached data={programData.filesInfo} programId={programId} onRefresh={refetch} />
          <Content data={programData.content} programId={programId} />
          <AdditionalInfo data={programData.additionalInfo} />
          <UploadDeliverySection programId={programId} />
          <UploadTable data={programData.campaignDeliveries} programId={programId} />
        </div>

        <div className="col-span-12 xl:col-span-3 space-y-4  ">
          <DescriptionOfFilesAttached data={programData.descriptionOfFilesAttached} />
          <ProgramStatus data={programData} programId={programId} />
          <Activity data={programData.updates} />
        </div>
      </div>
    </div>
  );
};

export default ProgramDetailPage;
