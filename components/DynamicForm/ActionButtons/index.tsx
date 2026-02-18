import React, { useState } from "react";
import {
  deleteItem,
  updateItemData,
  emptyItemTemplate,
  updateAppData,
} from "@/query/appData";
import { useAppContext } from "@/app/context";
import { useParticipantContext } from "../context";

const ActionButtons = ({ currentItem }: { currentItem: string }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { password, setCurrentItem, items, setItems } = useAppContext();
  const { loadItemData } = useParticipantContext();

  const onReset = async () => {
    setIsLoading(true);
    try {
      await updateItemData(emptyItemTemplate, password, currentItem);
      await loadItemData();
    } catch (e) {
      console.error(e);
      alert("Failed to reset item");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);

    const newItems = items.filter((item) => item.id !== currentItem);

    try {
      await updateAppData({ items: newItems }, password);
      setItems(newItems);
    } catch (e) {
      console.error(e);
      alert("Failed to reset item");
      return;
    } finally {
      setIsLoading(false);
    }

    try {
      await deleteItem(currentItem, password);

      setCurrentItem(null);
    } catch (e) {
      console.error(e);
      alert("Failed to reset item");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Sticky footer for mobile */}
      <div
        className="
          fixed
          bottom-0
          left-0
          w-full
          z-30
          bg-neutral-100
          border-neutral-100
          dark:bg-neutral-900
          border-t
          dark:border-neutral-900
          p-4
          flex
          flex-col
          gap-2
          items-stretch
          dark:md:bg-transparent
          dark:md:shadow-none
          dark:shadow-[0_0_29px_0_rgba(255,255,255,0.2)]
          shadow-[0_0_29px_0_rgba(0,0,0,0.2)]
          lg:static
          lg:p-0
          lg:bg-transparent
          lg:border-0
          lg:shadow-none
          lg:items-end
          lg:w-auto
        "
      >
        <div className="flex lg:flex-col gap-2 w-full lg:w-auto lg:pt-8">
          <button
            className="bg-red-600 border border-red-700 transition-colors hover:bg-red-700 text-white rounded-md h-10 py-2 px-4 disabled:opacity-50 w-full lg:w-auto"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Delete"}
          </button>
          <button
            className="bg-black border border-gray-600 transition-colors hover:bg-gray-600 text-white rounded-md h-10 py-2 px-4 disabled:opacity-50 w-full lg:w-auto"
            onClick={() => setShowResetConfirm(true)}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Reset"}
          </button>
        </div>
      </div>
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => !isLoading && setShowResetConfirm(false)}
          />
          <div className="relative border-neutral-200 bg-neutral-100 dark:bg-black border dark:border-gray-600 rounded-md p-6 shadow-lg flex flex-col gap-4 min-w-[320px]">
            <p className="mb-2 text-center">
              {isLoading ? "Resetting..." : "Are you sure you want to reset?"}
            </p>
            {isLoading ? (
              <div className="flex justify-center items-center h-10">
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  className="bg-black border border-gray-600 transition-colors hover:bg-gray-600 text-white rounded-md h-10 py-2 px-4 flex-1"
                  onClick={async () => {
                    await onReset();
                    setShowResetConfirm(false);
                  }}
                >
                  Yes
                </button>
                <button
                  className="bg-white dark:bg-gray-200 border border-black dark:border-gray-300 transition-colors hover:bg-neutral-200 dark:hover:bg-gray-300 text-black rounded-md h-10 py-2 px-4 flex-1"
                  onClick={() => setShowResetConfirm(false)}
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => !isLoading && setShowDeleteConfirm(false)}
          />
          <div className="relative border-neutral-200 bg-neutral-100 dark:bg-black border dark:border-gray-600 rounded-md p-6 shadow-lg flex flex-col gap-4 min-w-[320px]">
            <p className="mb-2 text-center">
              {isLoading ? "Deleting..." : "Are you sure you want to delete?"}
            </p>
            {isLoading ? (
              <div className="flex justify-center items-center h-10">
                <svg
                  className="animate-spin h-6 w-6 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  className="bg-red-600 border border-red-700 transition-colors hover:bg-red-700 text-white rounded-md h-10 py-2 px-4 flex-1"
                  onClick={async () => {
                    await onDelete();
                    setShowDeleteConfirm(false);
                  }}
                >
                  Yes
                </button>
                <button
                  className="bg-white dark:bg-gray-200 border border-black dark:border-gray-300 transition-colors hover:bg-neutral-200 dark:hover:bg-gray-300 text-black rounded-md h-10 py-2 px-4 flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtons;
