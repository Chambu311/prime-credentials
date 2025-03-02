const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white/70 dark:bg-gray-900/70 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="text-indigo-600 dark:text-indigo-400 font-medium animate-pulse text-2xl">Loading...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;