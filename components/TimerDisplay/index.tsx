import React, { useState, useEffect } from "react";
import { useAppContext } from "@/app/context";

const MOBILE_HEADER_HEIGHT = 56; // px

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-600 flex-shrink-0 mt-1"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const TimerDisplay = () => {
  const { timerTarget, isUpdatePending, showSaveConfirmation } =
    useAppContext();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!timerTarget) return;
    const interval = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(interval);
  }, [timerTarget]);

  if (!isUpdatePending && !showSaveConfirmation) return null;

  const secondsLeft = timerTarget
    ? Math.max(0, Math.round((timerTarget - now) / 1000))
    : 0;

  // Mobile
  const mobileContent = showSaveConfirmation ? (
    <>
      <CheckIcon />
      <span className="break-words font-semibold text-green-700">
        App state saved successfully!
      </span>
    </>
  ) : (
    <>
      <span className="w-4 h-4 box-border border-2 border-neutral-400 border-t-neutral-700 rounded-full animate-spin inline-block flex-shrink-0 mt-1" />
      <span className="break-words">
        <span className="font-semibold text-red-600">
          Do not close this page.
        </span>{" "}
        App state will be saved in{" "}
        <span className="font-semibold">{secondsLeft}</span> second
        {secondsLeft !== 1 ? "s" : ""} (API limitation)
      </span>
    </>
  );

  // Desktop
  const desktopContent = showSaveConfirmation ? (
    <>
      <CheckIcon />
      <span className="font-semibold text-green-700">
        App state saved successfully!
      </span>
    </>
  ) : (
    <>
      <span className="w-4 h-4 border-2 border-neutral-400 border-t-neutral-700 rounded-full animate-spin inline-block" />
      <span>
        <span className="font-semibold text-red-600">
          Do not close this page.
        </span>{" "}
        App state will be saved in{" "}
        <span className="font-semibold">{secondsLeft}</span> second
        {secondsLeft !== 1 ? "s" : ""} (API limitation)
      </span>
    </>
  );

  return (
    <>
      {/* Mobile: full-width bar fixed below header */}
      <div
        className={`
          fixed left-0 z-30 w-full
          bg-neutral-100 border-b border-neutral-400 text-neutral-900 px-4 py-3 flex items-start gap-3
          animate-slide-down
          md:hidden
        `}
        style={{
          minHeight: "3rem",
          top: MOBILE_HEADER_HEIGHT,
        }}
      >
        {mobileContent}
      </div>
      {/* Desktop: centered floating toast */}
      <div
        className={`
          hidden md:flex
          fixed top-4 left-1/2 -translate-x-1/2 z-50
          bg-neutral-100 border border-neutral-400 text-neutral-900 px-6 py-3 rounded shadow-lg items-center gap-3
          animate-slide-in
        `}
      >
        {desktopContent}
      </div>
      <style>
        {`
          @keyframes slide-in {
            0% { transform: translate(-50%, -40px); opacity: 0; }
            100% { transform: translate(-50%, 0); opacity: 1; }
          }
          .animate-slide-in {
            animation: slide-in 0.4s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes slide-down {
            0% { transform: translateY(-40px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-down {
            animation: slide-down 0.4s cubic-bezier(0.4,0,0.2,1);
          }
        `}
      </style>
    </>
  );
};

export default TimerDisplay;
