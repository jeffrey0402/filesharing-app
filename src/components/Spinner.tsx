export const Spinner = () => {
    return (
      <div className="flex items-center justify-center">
        <div
          className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
          role="status"
        >
          <span className="hidden">Loading...</span>
        </div>
      </div>
    );
  };
  