"use client";

import HeroSection from "@/components/layout/HeroSection";
import SearchFilters from "@/components/groups/SearchFilters";
import GroupList from "@/components/groups/GroupList";
import FloatingActionButton from "@/components/ui/FloatingActionButton";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SearchFilters />
      <GroupList />
      <FloatingActionButton />
    </>
  );
}
