import React from "react";

type SidebarFormProps = {
  onAdd: (e: React.FormEvent) => void;
  newLabel: string;
  setNewLabel: (label: string) => void;
  isLoading: boolean;
};

const SidebarForm: React.FC<SidebarFormProps> = ({
  onAdd,
  newLabel,
  setNewLabel,
  isLoading,
}) => (
  <form
    onSubmit={onAdd}
    className="absolute bottom-0 left-0 w-full px-2 pb-6 pt-4 border-t border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 flex gap-2"
  >
    <input
      type="text"
      className="border px-2 mr-1 rounded-md w-4/5 h-10 border-neutral-300 dark:border-gray-600"
      placeholder="Add new item"
      value={newLabel}
      onChange={(e) => setNewLabel(e.target.value)}
      disabled={isLoading}
    />
    <button
      type="submit"
      className="bg-black border-gray-600 border-2 transition-colors hover:bg-gray-600 text-white rounded-md py-2 h-10 px-4 flex-1"
      aria-label="Add"
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="animate-spin inline-block mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
      ) : (
        "+"
      )}
    </button>
  </form>
);

export default SidebarForm;
