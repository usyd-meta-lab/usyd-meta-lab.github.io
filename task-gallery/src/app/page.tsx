"use client";

import Header from "@/components/showcase/Header";
import FilterBar from "@/components/showcase/FilterBar";
import ShowcaseGrid from "@/components/showcase/ShowcaseGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <FilterBar />
      <ShowcaseGrid />
    </main>
  );
}
