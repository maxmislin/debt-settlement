import React from "react";

const NoItemSelected: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 w-full">
    <h2 className="text-xl font-semibold mb-2">No Item Selected</h2>
    <p>Please select an item to view or edit details.</p>
  </div>
);

export default NoItemSelected;
