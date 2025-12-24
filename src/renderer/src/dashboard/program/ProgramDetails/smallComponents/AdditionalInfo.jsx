export const AdditionalInfo = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Additional Information</h4>
      </div>

      <div className="bg-white  dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 text-sm space-y-4">
        <div dangerouslySetInnerHTML={{ __html: data }} />
      </div>
    </>
  );
};
