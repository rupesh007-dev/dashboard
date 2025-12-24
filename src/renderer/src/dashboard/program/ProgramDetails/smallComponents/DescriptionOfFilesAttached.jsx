export const DescriptionOfFilesAttached = ({ data }) => {
  return (
    // <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 text-sm space-y-4">
    //   <h4 className="text-lg font-medium text-gray-900 dark:text-white">Description Of Files Attached</h4>

    // </div>

    <>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">File Description</h4>
        {data && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium">
            Attached
          </span>
        )}
      </div>

      <div className="w-full bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 p-5 lg:p-6  ">
        {data ? (
          <div
            className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed wrap-break-word overflow-hidden"
            dangerouslySetInnerHTML={{ __html: data }}
          />
        ) : (
          <div className="flex items-center gap-3 py-2 text-gray-400 dark:text-gray-500">
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm italic">No description available for these files.</p>
          </div>
        )}
      </div>
    </>
  );
};
