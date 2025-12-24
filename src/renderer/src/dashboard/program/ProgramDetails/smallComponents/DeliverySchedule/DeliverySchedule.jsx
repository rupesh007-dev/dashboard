import { TicketCheck, Upload } from 'lucide-react';

import { useState } from 'react';
import { Drawer } from '../../../../../components/common/Drawer';
import AppTooltip from '../../../../../components/common/Tooltip';
import { Slicestring } from '../../../../../components/common/Slicestring';
import Pacings from './Pacings/Pacings';
import WithTemplateValidation from './withTemplateValidation/WithTemplateValidation';

export const DeliverySchedule = ({ data, files }) => {
  const [selectedVolumeId, setSelectedVolumeId] = useState(null);
  const [volumeIdfortemplate, setVolumeIdForTemplate] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [volumeName, setVolumeName] = useState('');
  const [leadTemplate, setLeadTemplate] = useState({});
  const [externalRules, setExternalRules] = useState([]);

  if (selectedVolumeId) {
    return (
      <Pacings
        volumeId={selectedVolumeId}
        onBack={() => {
          setSelectedVolumeId(null);
        }}
      />
    );
  }

  const handledraweropenandId = (id, isOpen, volumeName, leatemplate, externalRules) => {
    setVolumeIdForTemplate(id);
    setIsDrawerOpen(isOpen);
    setVolumeName(volumeName);
    setLeadTemplate(leatemplate);
    setExternalRules(externalRules);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Delivery Schedule</h4>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 space-y-6">
        {data?.map((delivery, i) => (
          <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              {/* Content Section */}
              <div className="flex-1 space-y-4">
                <AppTooltip message={delivery.name}>
                  <div className="inline-block">
                    <p className="font-bold text-gray-900 text-base dark:text-white cursor-pointer hover:text-blue-600 transition-colors">
                      {Slicestring(delivery.name, 1, 35)}
                      {delivery.name?.length > 35 && '...'}
                    </p>
                  </div>
                </AppTooltip>

                {/* Stats Grid - Aligned Left */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                  {[
                    { label: 'VALID', value: delivery.completed, color: 'text-green-600 dark:text-green-400' },
                    { label: 'PENDING', value: delivery.pending, color: 'text-amber-600 dark:text-amber-400' },
                    { label: 'TOTAL', value: delivery.leadGoal, color: 'text-gray-900 dark:text-white' },
                    { label: 'TOTAL PACINGS', value: 8, color: 'text-gray-900 dark:text-white' },
                    { label: 'DUE PACING', value: '02-12-2025', color: 'text-gray-900 dark:text-white' },
                    { label: 'LAST PACING', value: '02-12-2025', color: 'text-gray-900 dark:text-white' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 transition-all hover:border-gray-300"
                    >
                      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 mb-1">
                        {item.label}
                      </p>
                      <p className={`text-sm font-semibold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons Section - Now Aligned Top-Right on Desktop */}
              <div className="flex flex-row lg:flex-col shrink-0 gap-2 lg:w-40">
                <button
                  onClick={() =>
                    handledraweropenandId(
                      delivery.id,
                      true,
                      delivery.name,
                      delivery.leadTemplate,
                      delivery.externalRules
                    )
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-all shadow-sm"
                >
                  <TicketCheck size={14} /> Validations
                </button>

                <button
                  onClick={() => setSelectedVolumeId(delivery.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs font-medium bg-gray-600 text-white hover:bg-gray-700 transition-all shadow-sm"
                >
                  <Upload size={14} /> Upload File
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Drawer remains the same */}
        {isDrawerOpen && (
          <Drawer open={isDrawerOpen} setOpen={setIsDrawerOpen} width="80%">
            <WithTemplateValidation
              volumeId={volumeIdfortemplate}
              volumeValidationProfile={leadTemplate}
              vName={volumeName}
              externalRules={externalRules}
              files={files}
            />
          </Drawer>
        )}
      </div>
    </>
  );
};
