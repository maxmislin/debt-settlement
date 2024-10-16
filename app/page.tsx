"use client";

import DynamicForm from "@/components/DynamicForm";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start p-6">
      <DynamicForm />
    </main>
  );
}
