'use client';

import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import SearchFilters from '@/components/groups/SearchFilters';
import GroupList from '@/components/groups/GroupList';
import MapView from '@/components/map/MapView';

export default function HomePage() {
  return (
    <main className="h-screen bg-white flex flex-col">
      <Header />
      <HeroSection />
      <SearchFilters />
      
      {/* Main Content Area - Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Group Cards (60% on desktop) */}
        <div className="w-full lg:w-3/5 border-r overflow-hidden" style={{ borderColor: 'var(--c3-border)' }}>
          <GroupList />
        </div>
        
        {/* Right Panel - Map View (40% on desktop) */}
        <div className="w-full lg:w-2/5 h-full">
          <MapView />
        </div>
      </div>
    </main>
  );
}