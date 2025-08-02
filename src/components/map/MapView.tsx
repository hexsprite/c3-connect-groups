"use client";

import { useEffect, useRef, useState } from "react";
import { useGroupStore } from "@/store/useGroupStore";
import { Group } from "@/types";

declare global {
  interface Window {
    google: any;
  }
}

export default function MapView() {
  const { groups, map, updateMapState, ui, updateUIState } = useGroupStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Load Google Maps script
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.head.appendChild(script);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

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
                  onclick="window.open('${group.planningCenterUrl}', '_blank')"
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
    };

    loadGoogleMaps();

    return () => {
      // Clean up markers
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [groups, updateMapState, updateUIState]);

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
}
