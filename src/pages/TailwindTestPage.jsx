import React from "react";

export default function TailwindTestPage() {
  return (
    <div className="flex items-center justify-center bg-gray-900 text-white px-4 py-8">
      <div className="max-w-sm w-full rounded-2xl overflow-hidden shadow-lg p-6 bg-gray-800 hover:shadow-2xl transition-shadow duration-300">
        <img
          className="w-full h-40 object-cover rounded-md mb-4"
          src="https://via.placeholder.com/400x200"
          alt="Modern Tailwind Card"
        />
        <div className="text-xl font-bold text-blue-400 mb-2">
          Modern Tailwind Card
        </div>
        <p className="text-gray-300 mb-4">
          This is a custom card styled with Tailwind CSS. It includes a smooth hover effect,
          crisp shadows, and a modern look.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Learn More
        </button>
      </div>
    </div>
  );
}
