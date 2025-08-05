'use client';

import { useState, useRef, ReactNode } from 'react';
import { useGroupStore } from '@/store/useGroupStore';
import { Group } from '@/types';

interface BottomSheetProps {
  children: ReactNode;
}

type SheetState = 'collapsed' | 'half' | 'full';

export default function BottomSheet({ children }: BottomSheetProps) {
  const [sheetState, setSheetState] = useState<SheetState>('collapsed');
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const groups = useGroupStore(state => state.groups);

  // Heights for different states (in vh)
  const heights = {
    collapsed: 15, // 120px at 812px screen ≈ 15vh
    half: 50,
    full: 85
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const deltaY = currentY - startY;
    const threshold = 50; // Minimum drag distance to trigger state change

    if (Math.abs(deltaY) < threshold) return;

    if (deltaY > 0) {
      // Dragging down - collapse
      if (sheetState === 'full') setSheetState('half');
      else if (sheetState === 'half') setSheetState('collapsed');
    } else {
      // Dragging up - expand
      if (sheetState === 'collapsed') setSheetState('half');
      else if (sheetState === 'half') setSheetState('full');
    }
  };

  const getSheetHeight = () => {
    if (isDragging) {
      const deltaY = currentY - startY;
      const currentHeight = heights[sheetState];
      const newHeight = currentHeight - (deltaY / window.innerHeight * 100);
      return Math.min(Math.max(newHeight, heights.collapsed), heights.full);
    }
    return heights[sheetState];
  };

  return (
    <div 
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 transition-all duration-300 ease-out"
      style={{ 
        height: `${getSheetHeight()}vh`,
        borderTopLeftRadius: '16px',
        borderTopRightRadius: '16px',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Handle bar */}
      <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
        <div 
          className="w-12 h-1 bg-gray-300 rounded-full"
          style={{ backgroundColor: 'var(--c3-border)' }}
        />
      </div>

      {/* Content based on state */}
      <div className="px-4 h-full overflow-hidden">
        {sheetState === 'collapsed' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium" style={{ color: 'var(--c3-text-primary)' }}>
                {groups?.length || 0} groups found
              </p>
              <button 
                onClick={() => setSheetState('half')}
                className="text-sm font-medium"
                style={{ color: 'var(--c3-primary-blue)' }}
              >
                View List
              </button>
            </div>
            
            {/* Sample cards horizontal scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {groups?.slice(0, 3).map((group: Group, index: number) => (
                <div 
                  key={index}
                  className="flex-shrink-0 w-64 p-3 border rounded-lg"
                  style={{ borderColor: 'var(--c3-border)' }}
                >
                  <h4 className="text-sm font-medium truncate" style={{ color: 'var(--c3-text-primary)' }}>
                    {group.name}
                  </h4>
                  <p className="text-xs mt-1 text-gray-500 line-clamp-2">
                    {group.description}
                  </p>
                </div>
              )) || []}
            </div>
          </div>
        )}

        {(sheetState === 'half' || sheetState === 'full') && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b" style={{ borderColor: 'var(--c3-border)' }}>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--c3-text-primary)' }}>
                {groups?.length || 0} Groups
              </h3>
              <div className="flex gap-2">
                <button className="text-sm px-3 py-1 border rounded" style={{ borderColor: 'var(--c3-border)', color: 'var(--c3-text-secondary)' }}>
                  Filter
                </button>
                <button className="text-sm px-3 py-1 border rounded" style={{ borderColor: 'var(--c3-border)', color: 'var(--c3-text-secondary)' }}>
                  Sort
                </button>
              </div>
            </div>

            {/* Full search bar for expanded state */}
            {sheetState === 'full' && (
              <div className="py-4 border-b" style={{ borderColor: 'var(--c3-border)' }}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search groups..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                    style={{ borderColor: 'var(--c3-border)' }}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto pt-4">
              {children}
            </div>
          </div>
        )}
      </div>

      {/* Tap map strip to collapse (only in full state) */}
      {sheetState === 'full' && (
        <button
          onClick={() => setSheetState('half')}
          className="absolute -top-12 left-0 right-0 h-12 bg-black bg-opacity-20 text-white text-xs flex items-center justify-center"
        >
          Tap to show more map
        </button>
      )}
    </div>
  );
}