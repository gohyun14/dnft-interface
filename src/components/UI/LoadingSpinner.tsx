import React from 'react';

const LoadingSpinner = () => {
  return (
    <>
      <div className="my-40 grid place-content-center">
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="block h-20 w-20 animate-spin rounded-full border-4 border-t-indigo-400"></svg>
        </div>
      </div>
    </>
  );
};

export default LoadingSpinner;
