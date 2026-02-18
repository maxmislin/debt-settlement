import React from "react";
import SidebarList from "../SidebarList";
import { Item } from "@/app/context";
import SidebarForm from "../SidebarForm";

type SidebarDrawerProps = {
  open: boolean;
  items: Item[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  onAdd: (e: React.FormEvent) => void;
  newLabel: string;
  setNewLabel: (label: string) => void;
  isLoading: boolean;
};

const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  open,
  items,
  selected,
  onSelect,
  onClose,
  onAdd,
  setNewLabel,
  newLabel,
  isLoading,
}) => (
  <>
    {open && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
    )}
    <aside
      className={`
        fixed top-0 left-0 h-full w-64 bg-neutral-100 dark:bg-neutral-900 dark:text-white z-50
        transform ${open ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-200
        md:hidden
      `}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200 dark:border-neutral-700 mb-3">
        <span className="text-lg font-semibold">Debt Settlement</span>
        <button
          className="text-2xl"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          &times;
        </button>
      </div>
      <SidebarList onSelect={onSelect} items={items} selected={selected} />
      <SidebarForm
        onAdd={onAdd}
        setNewLabel={setNewLabel}
        newLabel={newLabel}
        isLoading={isLoading}
      />
    </aside>
  </>
);

export default SidebarDrawer;
