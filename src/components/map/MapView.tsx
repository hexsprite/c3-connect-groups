"use client";

import { useEffect, useRef, useState } from "react";
import { useGroupStore } from "@/store/useGroupStore";
import { Group } from "@/types";

declare global {
  interface Window {
    google: any;
  }
}

// Track if Google Maps script is already loaded
let googleMapsLoaded = false;
let googleMapsLoading = false;

export default function MapView() {
  const { groups, map, updateMapState, ui, updateUIState } = useGroupStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Check if we have a valid Google Maps API key
  const hasValidApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY &&
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== "demo" &&
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !==
      "your_google_maps_api_key_here";

  const showFallbackContent = () => {
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div class="text-center p-6">
            <div class="text-gray-500 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Map View</h3>
            <p class="text-sm text-gray-600 mb-4">Showing ${
              groups.length
            } groups in Toronto area</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
              <div>📍 ${
                groups.filter((g) => g.campusLocation === "Downtown").length
              } Downtown Groups</div>
              <div>📍 ${
                groups.filter((g) => g.campusLocation === "Midtown").length
              } Midtown Groups</div>
              <div>📍 ${
                groups.filter((g) => g.campusLocation === "Hamilton").length
              } Hamilton Groups</div>
            </div>
            ${
              !hasValidApiKey
                ? '<p class="text-xs text-gray-500 mt-4">Add a valid Google Maps API key to see the interactive map</p>'
                : ""
            }
          </div>
        </div>
      `;
    }
  };

  useEffect(() => {
    // If no valid API key, show fallback immediately
    if (!hasValidApiKey) {
      console.log(
        "⚠️ No valid Google Maps API key found, showing fallback content"
      );
      setMapError(true);
      showFallbackContent();
      return;
    }

    // Load Google Maps script only if we have a valid API key
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        googleMapsLoaded = true;
        initializeMap();
      } else if (!googleMapsLoading) {
        googleMapsLoading = true;
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          googleMapsLoaded = true;
          googleMapsLoading = false;
          initializeMap();
        };
        script.onerror = () => {
          console.error("Failed to load Google Maps");
          googleMapsLoading = false;
          setMapError(true);
          showFallbackContent();
        };
        document.head.appendChild(script);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      try {
        if (!window.google || !window.google.maps) {
          setMapError(true);
          showFallbackContent();
          return;
        }

        const mapOptions = {
          center: { lat: 43.6532, lng: -79.3832 }, // Toronto center
          zoom: 11,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        };

        mapInstanceRef.current = new window.google.maps.Map(
          mapRef.current,
          mapOptions
        );
        setIsMapLoaded(true);

        // Add markers for groups with coordinates
        groups.forEach((group) => {
          if (group.latitude && group.longitude) {
            const marker = new window.google.maps.Marker({
              position: { lat: group.latitude, lng: group.longitude },
              map: mapInstanceRef.current,
              title: group.name,
              icon: {
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#2563eb"/>
                    <circle cx="16" cy="16" r="12" fill="white"/>
                    <circle cx="16" cy="16" r="8" fill="#2563eb"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(32, 32),
              },
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 8px; max-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${
                    group.name
                  }</h3>
                  <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">${
                    group.location
                  }</p>
                  <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">${
                    group.meetingDay
                  }s, ${group.meetingTime}</p>
                  <button 
                    onclick="window.open('${
                      group.planningCenterUrl
                    }', '_blank')"
                    style="
                      background: #2563eb; 
                      color: white; 
                      border: none; 
                      padding: 6px 12px; 
                      border-radius: 6px; 
                      font-size: 12px; 
                      cursor: pointer;
                      width: 100%;
                    "
                  >
                    ${group.isOpen ? "REGISTER HERE" : "GROUP FULL"}
                  </button>
                </div>
              `,
            });

            marker.addListener("click", () => {
              infoWindow.open(mapInstanceRef.current, marker);
              updateUIState({ selectedGroup: group.id });
            });

            markersRef.current.push(marker);
          }
        });

        // Update map state when bounds change
        mapInstanceRef.current.addListener("bounds_changed", () => {
          const bounds = mapInstanceRef.current.getBounds();
          updateMapState({ bounds });
        });
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError(true);
        showFallbackContent();
      }
    };

    loadGoogleMaps();

    return () => {
      // Clean up markers
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [groups, updateMapState, updateUIState, hasValidApiKey]);

  // Show fallback if map fails to load or no API key
  if (mapError || !hasValidApiKey) {
    return (
      <div className="w-full h-full">
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center p-6">
            <div className="text-gray-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Map View
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Showing {groups.length} groups in Toronto area
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
              <div>
                📍{" "}
                {groups.filter((g) => g.campusLocation === "Downtown").length}{" "}
                Downtown Groups
              </div>
              <div>
                📍 {groups.filter((g) => g.campusLocation === "Midtown").length}{" "}
                Midtown Groups
              </div>
              <div>
                📍{" "}
                {groups.filter((g) => g.campusLocation === "Hamilton").length}{" "}
                Hamilton Groups
              </div>
            </div>
            {!hasValidApiKey && (
              <p className="text-xs text-gray-500 mt-4">
                Add a valid Google Maps API key to see the interactive map
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
}
