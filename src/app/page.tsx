"use client";

import HeroSection from "@/components/layout/HeroSection";
import SearchFilters from "@/components/groups/SearchFilters";
import GroupList from "@/components/groups/GroupList";
import MapView from "@/components/map/MapView";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import { useGroupStore } from "@/store/useGroupStore";

export default function Home() {
  const { ui } = useGroupStore();

  return (
    <>
      <HeroSection />
      <SearchFilters />

      {/* Content Area */}
      <div className="flex-1">
        {ui.view === "map" ? (
          <div className="h-[calc(100vh-400px)] min-h-[500px]">
            <MapView />
          </div>
        ) : (
          <GroupList />
        )}
      </div>

      <FloatingActionButton />
    </>
  );
}
