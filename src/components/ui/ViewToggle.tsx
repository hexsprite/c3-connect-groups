'use client';

import { useEffect, useState } from 'react';
import { useGroupStore } from '@/store/useGroupStore';

type ViewType = 'list' | 'split' | 'map';

interface ViewToggleProps {
  className?: string;
}

export default function ViewToggle({ className = '' }: ViewToggleProps) {
  const { ui, updateUIState } = useGroupStore();
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Switch from split view to list view on mobile
  useEffect(() => {
    if (isMobile && ui.view === 'split') {
      updateUIState({ view: 'list' });
    }
  }, [isMobile, ui.view, updateUIState]);

  const handleViewChange = (view: ViewType) => {
    updateUIState({ view });
  };

  const views = [
    {
      type: 'list' as ViewType,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
        </svg>
      ),
      label: 'List view',
      description: 'View groups in a full-width list'
    },
    {
      type: 'split' as ViewType,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M2 4a2 2 0 012-2h3a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zM11 4a2 2 0 012-2h3a2 2 0 012 2v12a2 2 0 01-2 2h-3a2 2 0 01-2-2V4z" />
        </svg>
      ),
      label: 'Split view',
      description: 'View groups and map side by side'
    },
    {
      type: 'map' as ViewType,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      label: 'Map view',
      description: 'View groups on a full-width map'
    }
  ];

  return (
    <div 
      className={`absolute top-4 right-4 z-10 bg-white shadow-lg rounded-lg border ${className}`}
      style={{ borderColor: 'var(--c3-border)' }}
      role="group"
      aria-label="View controls"
    >
      <div className="flex">
        {views.filter(view => !isMobile || view.type !== 'split').map((view, index, filteredViews) => {
          const isActive = ui.view === view.type;
          
          return (
                          <button
                key={view.type}
                onClick={() => handleViewChange(view.type)}
                className={`
                  flex items-center justify-center p-3 transition-all duration-200 ease-in-out
                  ${index === 0 ? 'rounded-l-lg' : ''}
                  ${index === filteredViews.length - 1 ? 'rounded-r-lg' : ''}
                  ${isActive 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'hover:bg-gray-50'
                  }
                  ${!isActive ? 'border-r last:border-r-0' : ''}
                  ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-700'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
                  active:scale-95 transform
                `}
                style={{
                  borderColor: isActive ? undefined : 'var(--c3-border)',
                  color: isActive ? 'var(--c3-primary-blue)' : 'var(--c3-text-secondary)'
                }}
                aria-pressed={isActive}
                aria-label={view.label}
                title={view.description}
                type="button"
              >
              {view.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Hook for keyboard shortcuts (optional enhancement)
export function useViewToggleShortcuts() {
  const { updateUIState } = useGroupStore();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case '1':
          event.preventDefault();
          updateUIState({ view: 'list' });
          break;
        case '2':
          event.preventDefault();
          updateUIState({ view: 'split' });
          break;
        case '3':
          event.preventDefault();
          updateUIState({ view: 'map' });
          break;
      }
    }
  };

  // This hook can be called in the main layout to enable shortcuts
  return { handleKeyDown };
}