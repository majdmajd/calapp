import React from "react";

export default function CustomCard({ title, content, imageUrl }) {
  return (
    <div className="max-w-sm bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-xl transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-400 mb-2">{title}</h2>
        <p className="text-gray-300 text-sm">{content}</p>
        <div className="mt-4">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
