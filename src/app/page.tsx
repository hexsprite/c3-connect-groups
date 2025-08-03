'use client';

import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import SearchFilters from '@/components/groups/SearchFilters';
import GroupList from '@/components/groups/GroupList';
import MapView from '@/components/map/MapView';
import ViewToggle, { useViewToggleShortcuts } from '@/components/ui/ViewToggle';
import { useGroupStore } from '@/store/useGroupStore';

export default function HomePage() {
  const { ui } = useGroupStore();
  const { handleKeyDown } = useViewToggleShortcuts();

  // Enable keyboard shortcuts
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Calculate panel classes based on view state
  const getLeftPanelClasses = () => {
    const baseClasses = "h-full overflow-hidden transition-all duration-300 ease-in-out";
    
    switch (ui.view) {
      case 'list':
        return `w-full ${baseClasses}`;
      case 'split':
        return `w-full lg:w-3/5 ${baseClasses} border-r`;
      case 'map':
        return `w-0 ${baseClasses}`; // Use w-0 instead of hidden for smooth animation
      default:
        return `w-full lg:w-3/5 ${baseClasses} border-r`;
    }
  };

  const getRightPanelClasses = () => {
    const baseClasses = "h-full overflow-hidden transition-all duration-300 ease-in-out";
    
    switch (ui.view) {
      case 'list':
        return `w-0 ${baseClasses}`; // Use w-0 instead of hidden for smooth animation
      case 'split':
        return `w-full lg:w-2/5 ${baseClasses}`;
      case 'map':
        return `w-full ${baseClasses}`;
      default:
        return `w-full lg:w-2/5 ${baseClasses}`;
    }
  };

  return (
    <main className="h-screen bg-white flex flex-col">
      <Header />
      <HeroSection />
      <SearchFilters />
      
      {/* Main Content Area - Dynamic Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* ViewToggle positioned absolute */}
        <ViewToggle />
        
        {/* Left Panel - Group Cards (Dynamic width based on view state) */}
        <div 
          className={getLeftPanelClasses()} 
          style={{ borderColor: ui.view === 'split' ? 'var(--c3-border)' : 'transparent' }}
        >
          <div className={`w-full h-full ${ui.view === 'map' ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
            <GroupList />
          </div>
        </div>
        
        {/* Right Panel - Map View (Dynamic width based on view state) */}
        <div className={getRightPanelClasses()}>
          <div className={`w-full h-full ${ui.view === 'list' ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
            <MapView />
          </div>
        </div>
      </div>
    </main>
  );
}