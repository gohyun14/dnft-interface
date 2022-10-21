import React from 'react';

const MiniLoadingSpinner = () => {
  return (
    <>
      <div className=" text-gray-500">
        <svg className="block h-full w-full animate-spin rounded-full border-2 border-t-indigo-400"></svg>
      </div>
    </>
  );
};

export default MiniLoadingSpinner;
