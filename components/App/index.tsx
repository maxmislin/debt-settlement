"use client";

import { useState } from "react";
import DynamicForm from "@/components/DynamicForm";
import Sidebar from "@/components/Sidebar";
import SidebarDrawer from "@/components/Sidebar/SidebarDrawer";
import Loader from "../Loader";
import Auth from "../DynamicForm/Auth";
import { useAppContext } from "@/app/context";
import {
  createItemData,
  updateAppData,
  emptyItemTemplate,
} from "@/query/appData";
import { useSearchParams, useRouter } from "next/navigation";

export default function App() {
  const {
    items,
    setItems,
    isLoading: isAppLoading,
    password,
    isAuthenticated,
    currentItem,
    setCurrentItem,
  } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleAddSidebarItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newLabel.trim();
    if (!trimmed) return;

    let newValue = "";

    setIsLoading(true);
    try {
      const data = await createItemData(emptyItemTemplate, password, newLabel);

      if (data) {
        newValue = data.uri.split("/json/")[1];
      }
    } catch (e) {
      console.error(e);
      alert("Failed to create new item");
      return;
    } finally {
      setIsLoading(false);
    }

    const newItems = [...items, { name: trimmed, id: newValue }];

    setIsLoading(true);
    try {
      await updateAppData({ items: newItems }, password);
    } catch (e) {
      console.error(e);
      alert("Failed to update app data");
      return;
    } finally {
      setIsLoading(false);
    }

    setItems(newItems);
    setNewLabel("");
  };

  const handleItemSelect = (value: string) => {
    setCurrentItem(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("itemId", value);
    router.replace(`?${params.toString()}`);
  };

  if (isAppLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  const currentItemObj = items.find((item) => item.id === currentItem);

  return (
    <div className="flex h-screen">
      {/* Sidebar for desktop */}
      <Sidebar
        items={items}
        selected={currentItem ?? ""}
        onSelect={handleItemSelect}
        onAdd={handleAddSidebarItem}
        newLabel={newLabel}
        setNewLabel={setNewLabel}
        isLoading={isLoading}
      />

      {/* Header for mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-neutral-900 text-white flex items-center px-4 z-30 shadow">
        <button
          className="mr-4 mb-1 text-2xl text-neutral-300"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          &#9776;
        </button>
        <span className="font-semibold text-lg">
          {currentItemObj?.name || "Debt Settlement"}
        </span>
      </header>

      {/* Sidebar Drawer for mobile */}
      <SidebarDrawer
        open={sidebarOpen}
        items={items}
        selected={currentItem ?? ""}
        onSelect={(value) => {
          handleItemSelect(value);
          setSidebarOpen(false);
        }}
        onClose={() => setSidebarOpen(false)}
        onAdd={handleAddSidebarItem}
        newLabel={newLabel}
        setNewLabel={setNewLabel}
        isLoading={isLoading}
      />

      {/* Main content */}
      <main className="flex-1 w-full ml-0 md:ml-64 p-6 pt-16 md:pt-6">
        <section className="flex flex-col items-center sm:items-start">
          <DynamicForm />
        </section>
      </main>
    </div>
  );
}
