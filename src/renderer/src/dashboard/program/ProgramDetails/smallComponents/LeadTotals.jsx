export const LeadTotals = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Lead Totals</h4>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border bg-white  border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm  dark:bg-gray-800 justify-center  ">
        {[
          { label: 'LEAD GOAL', value: data?.leadgoal },
          { label: 'PENDING REVIEW', value: data?.pending },
          { label: 'ACCEPTED', value: data?.completed },
          { label: 'REJECTIONS', value: 99 },
        ].map((item) => (
          <div
            key={item.label}
            className="border-r border-gray-200 dark:border-gray-700 last:border-none py-3 px-4 lg:px-4 "
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 ">{item.label}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </>
  );
};
