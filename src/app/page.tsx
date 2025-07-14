'use client';

import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import SearchFilters from '@/components/groups/SearchFilters';
import GroupList from '@/components/groups/GroupList';
import MapView from '@/components/map/MapView';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <SearchFilters />
      
      {/* Main Content Area - Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - Group Cards (60% on desktop) */}
        <div className="w-full lg:w-3/5 border-r" style={{ borderColor: 'var(--c3-border)' }}>
          <GroupList />
        </div>
        
        {/* Right Panel - Map View (40% on desktop) */}
        <div className="w-full lg:w-2/5 min-h-[400px] lg:min-h-[600px]">
          <MapView />
        </div>
      </div>
    </main>
  );
}