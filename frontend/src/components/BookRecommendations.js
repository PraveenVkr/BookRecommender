export default function BookRecommendations({ recommendations, userPrompt }) {
  const { books, message } = recommendations;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Results Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📖 Your Personalized Recommendations
        </h2>
        <p className="text-gray-600 mb-2">
          <strong>Based on:</strong> "{userPrompt}"
        </p>
        <p className="text-green-700 font-medium">{message}</p>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
          >
            {/* Book Number Badge */}
            <div className="flex justify-between items-start mb-4">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                #{index + 1}
              </span>
              {book.rating && book.rating !== "N/A" && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  ⭐ {book.rating}
                </span>
              )}
            </div>

            {/* Book Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {book.title}
            </h3>

            {/* Author */}
            <p className="text-indigo-600 font-medium mb-2">by {book.author}</p>

            {/* Genre */}
            <span className="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full mb-3">
              {book.genre}
            </span>

            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {book.description}
            </p>

            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  const searchQuery = encodeURIComponent(
                    `${book.title} by ${book.author}`
                  );
                  window.open(
                    `https://www.google.com/search?q=${searchQuery}+book`,
                    "_blank"
                  );
                }}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-md transition-colors text-sm"
              >
                🔍 Find this book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">
              {books.length}
            </div>
            <div className="text-sm text-gray-600">Recommendations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {new Set(books.map((book) => book.genre)).size}
            </div>
            <div className="text-sm text-gray-600">Unique Genres</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {new Set(books.map((book) => book.author)).size}
            </div>
            <div className="text-sm text-gray-600">Different Authors</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {
                books.filter((book) => book.rating && book.rating !== "N/A")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600">With Ratings</div>
          </div>
        </div>
      </div>

      {/* Genres Overview */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          📚 Genres in Your Recommendations
        </h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(books.map((book) => book.genre))).map(
            (genre, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {genre}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
