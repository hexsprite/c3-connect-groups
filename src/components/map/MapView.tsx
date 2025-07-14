'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useGroupStore } from '@/store/useGroupStore';
import { Group } from '@/types';

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userLocationMarkerRef = useRef<google.maps.Marker | null>(null);
  const radiusCircleRef = useRef<google.maps.Circle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);

  const { groups, filters, map: mapState, updateMapState } = useGroupStore();

  // Filter groups based on current filters
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          group.name.toLowerCase().includes(searchTerm) ||
          group.description.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location && !filters.location.includes('All')) {
        if (group.campusLocation !== filters.location) return false;
      }

      // Day filter
      if (filters.day && !filters.day.includes('Any')) {
        if (group.meetingDay !== filters.day) return false;
      }

      // Time filter
      if (filters.time && !filters.time.includes('Any')) {
        if (group.meetingTime !== filters.time) return false;
      }

      // Type filter
      if (filters.type && filters.type !== 'Mixed') {
        if (group.groupType !== filters.type) return false;
      }

      return true;
    });
  }, [groups, filters]);

  // Initialize Google Maps
  useEffect(() => {
    // Skip if already loaded to prevent double initialization
    if (isMapLoaded) return;

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        
        if (!apiKey || apiKey.includes('your_google_maps_api_key_here')) {
          // Show fallback if no API key
          setError('Google Maps API key not configured');
          setIsLoading(false);
          return;
        }

        // Check if Google Maps is already loaded
        if (typeof google !== 'undefined' && google.maps) {
          // Google Maps already loaded, initialize directly
          initializeMap();
        } else {
          // Load Google Maps
          const loader = new Loader({
            apiKey: apiKey,
            version: 'weekly',
            libraries: ['marker']
          });

          await loader.load();
          initializeMap();
        }

        function initializeMap() {
          // Wait for mapRef to be available
          const tryInitialize = () => {
            if (mapRef.current && !mapInstanceRef.current) {
              // Clear any existing content
              mapRef.current.innerHTML = '';
              
              const map = new google.maps.Map(mapRef.current, {
                center: { lat: mapState.center.lat, lng: mapState.center.lng },
                zoom: mapState.zoom,
                styles: [
                  {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                  }
                ],
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
              });

              mapInstanceRef.current = map;
              setIsMapLoaded(true);
              setIsLoading(false);

              // Update store when map bounds change
              map.addListener('bounds_changed', () => {
                const center = map.getCenter();
                const zoom = map.getZoom();
                const bounds = map.getBounds();
                
                if (center && zoom) {
                  updateMapState({
                    center: { lat: center.lat(), lng: center.lng() },
                    zoom: zoom,
                    bounds: bounds
                  });
                }
              });
            } else if (!mapRef.current) {
              // Retry after a short delay if mapRef isn't ready
              setTimeout(tryInitialize, 100);
            }
          };
          
          tryInitialize();
        }

      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError('Failed to load Google Maps');
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure the component is mounted
    const timer = setTimeout(initMap, 100);
    
    // Safety timeout to clear loading state if something goes wrong
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 second timeout
    
    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update markers when filtered groups change
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add markers for filtered groups
    filteredGroups.forEach((group: Group) => {
      if (group.latitude && group.longitude) {
        const marker = new google.maps.Marker({
          position: { lat: group.latitude, lng: group.longitude },
          map: mapInstanceRef.current,
          title: group.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#006acc', // C3 primary blue
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: var(--c3-text-primary); font-size: 16px; font-weight: 600;">
                ${group.name}
              </h3>
              <p style="margin: 0 0 8px 0; color: var(--c3-text-secondary); font-size: 14px; line-height: 1.4;">
                ${group.description.substring(0, 100)}${group.description.length > 100 ? '...' : ''}
              </p>
              <div style="margin: 8px 0; color: var(--c3-text-secondary); font-size: 12px;">
                <div style="margin: 2px 0;">📍 ${group.location}</div>
                <div style="margin: 2px 0;">🕒 ${group.meetingDay}s, ${group.meetingTime}</div>
                <div style="margin: 2px 0;">👥 ${group.groupType} • ${group.currentMemberCount}/${group.capacity} members</div>
              </div>
              <a href="${group.planningCenterUrl}" target="_blank" 
                 style="display: inline-block; background-color: var(--c3-primary-blue); color: white; 
                        text-decoration: none; padding: 6px 12px; border-radius: 3px; font-size: 12px; 
                        margin-top: 8px;">
                Learn More →
              </a>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        markersRef.current.push(marker);
      }
    });

    // Adjust map bounds to show all markers if there are any
    if (markersRef.current.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [filteredGroups, isMapLoaded]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center" style={{ color: 'var(--c3-text-secondary)' }}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" 
               style={{ borderColor: 'var(--c3-primary-blue)' }}></div>
          <div>Loading map...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-6" style={{ color: 'var(--c3-text-secondary)' }}>
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--c3-text-primary)' }}>
            Map Unavailable
          </h3>
          <p className="text-sm mb-4">{error}</p>
          <div className="mt-4 space-y-2 text-xs">
            <div>📍 {groups.filter(g => g.campusLocation === 'Downtown').length} Downtown Groups</div>
            <div>📍 {groups.filter(g => g.campusLocation === 'Midtown').length} Midtown Groups</div>
            <div>📍 {groups.filter(g => g.campusLocation === 'Hamilton').length} Hamilton Groups</div>
          </div>
          <p className="text-xs mt-4 opacity-75">
            To enable the map, add your Google Maps API key to .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full" 
        style={{ minHeight: '400px' }}
      />
    </div>
  );
}