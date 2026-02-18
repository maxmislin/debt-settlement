"use client";

import App from "@/components/App";
import { AppProvider } from "./context";

export default function Home() {
  return (
    <AppProvider>
      <main>
        <App />
      </main>
    </AppProvider>
  );
}
