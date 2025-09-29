"use client";

import { useState } from "react";
import axios from "axios";
import BookRecommendations from "@/components/BookRecommendations";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter your book preferences");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations(null);

    try {
      const response = await axios.post("http://localhost:8000/recommend", {
        prompt: prompt.trim(),
      });

      setRecommendations(response.data);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to get recommendations. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📚 BookRec</h1>
          <p className="text-xl text-gray-300">
            Your AI-powered literary curator
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Discover your next favorite book with personalized recommendations
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-4xl mx-auto mb-8">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="mb-4">
              <label
                htmlFor="prompt"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                What kind of books are you looking for?
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., I love mystery novels with strong female protagonists, or I'm interested in historical fiction set in medieval times..."
                className="w-full px-3 py-2 border border-gray-600 bg-white text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                rows={4}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-300 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading
                ? "Finding perfect books for you..."
                : "Get Recommendations"}
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {/* Results */}
        {recommendations && !loading && (
          <BookRecommendations
            recommendations={recommendations}
            userPrompt={prompt}
          />
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>
            Powered by AI • Make sure your backend server is running on port
            8000
          </p>
        </div>
      </div>
    </div>
  );
}
