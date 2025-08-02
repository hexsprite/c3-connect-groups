"use client";

import { Plus, MessageCircle, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mb-4 space-y-3">
          <button
            onClick={() => {
              // Handle create group
              console.log("Create group clicked");
            }}
            className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Create Group</span>
          </button>

          <button
            onClick={() => {
              // Handle contact support
              console.log("Contact support clicked");
            }}
            className="flex items-center gap-3 bg-gray-700 text-white px-4 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Contact Support</span>
          </button>

          <button
            onClick={() => {
              // Handle help
              console.log("Help clicked");
            }}
            className="flex items-center gap-3 bg-gray-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Help</span>
          </button>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={toggleExpanded}
        className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
        aria-label="Quick actions"
      >
        <Plus
          className={`w-6 h-6 transition-transform duration-200 ${
            isExpanded ? "rotate-45" : ""
          }`}
        />
      </button>
    </div>
  );
}
