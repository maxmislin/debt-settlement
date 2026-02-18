"use client";

import React, { Suspense } from "react";
import App from "@/components/App";
import { AppProvider } from "./context";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppProvider>
        <main>
          <App />
        </main>
      </AppProvider>
    </Suspense>
  );
}
