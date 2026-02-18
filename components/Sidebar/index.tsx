import React from "react";
import SidebarForm from "./SidebarForm";
import SidebarList from "./SidebarList";
import { Item } from "@/app/context";

type SidebarProps = {
  items: Item[];
  selected: string;
  onSelect: (value: string) => void;
  onAdd: (e: React.FormEvent) => void;
  newLabel: string;
  setNewLabel: (label: string) => void;
  isLoading: boolean;
};

const Sidebar: React.FC<SidebarProps> = ({
  items,
  selected,
  onSelect,
  onAdd,
  newLabel,
  setNewLabel,
  isLoading,
}) => (
  <aside
    className={`
      hidden
      md:flex
      flex-col
      w-64
      bg-neutral-100
      dark:bg-neutral-900
      dark:text-white
      h-full
      fixed
      left-0
      top-0
      z-20
      border-r
      dark:border-neutral-700
      border-neutral-200
    `}
  >
    <div className="flex items-center justify-between px-4 pb-4 pt-8 border-b border-neutral-200 dark:border-neutral-700 mb-3">
      <span className="font-semibold text-lg tracking-tight">
        Debt Settlement
      </span>
    </div>
    <SidebarList onSelect={onSelect} items={items} selected={selected} />
    <SidebarForm
      onAdd={onAdd}
      setNewLabel={setNewLabel}
      newLabel={newLabel}
      isLoading={isLoading}
    />
  </aside>
);

export default Sidebar;
