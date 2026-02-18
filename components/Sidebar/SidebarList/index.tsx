import { Item } from "@/app/context";
import React from "react";

type SidebarListProps = {
  items: Item[];
  selected: string;
  onSelect: (value: string) => void;
};

const SidebarList: React.FC<SidebarListProps> = ({
  items,
  selected,
  onSelect,
}) => (
  <div className="flex flex-col gap-2 px-4 overflow-auto">
    {items.map((item) => (
      <button
        key={item.id}
        className={`text-left px-3 py-2 rounded transition ${
          selected === item.id
            ? "bg-neutral-300 dark:bg-neutral-700"
            : "hover:bg-neutral-400 dark:hover:bg-gray-800"
        }`}
        onClick={() => onSelect(item.id)}
      >
        {item.name}
      </button>
    ))}
  </div>
);

export default SidebarList;
