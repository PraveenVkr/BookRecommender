export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Animated Book Icon */}
      <div className="relative mb-4">
        <div className="animate-bounce">
          <div className="text-6xl">📚</div>
        </div>
        {/* Floating dots animation */}
        <div className="flex space-x-1 justify-center mt-4">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Curating your perfect books...
        </h3>
        <p className="text-gray-500 text-sm max-w-md">
          Shelfie is analyzing your preferences and searching through thousands
          of books to find your next favorite reads.
        </p>
      </div>

      {/* Progress Bar Animation */}
      <div className="mt-6 w-64 bg-gray-200 rounded-full h-2">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full animate-pulse"></div>
      </div>

      {/* Rotating Spinner */}
      <div className="mt-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>

      {/* Fun Loading Messages */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400 italic">
          This usually takes 10-30 seconds...
        </p>
      </div>
    </div>
  );
}
