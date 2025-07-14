"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useGroupStore } from "@/store/useGroupStore";
import { groupSearchService } from "@/lib/search";
import { Group } from "@/types";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function MapView() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const userLocationMarkerRef = useRef<google.maps.Marker | null>(null);
    const radiusCircleRef = useRef<google.maps.Circle | null>(null);
    const currentInfoWindowRef = useRef<google.maps.InfoWindow | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [areTilesLoaded, setAreTilesLoaded] = useState(false);
    const [userLocation, setUserLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [locationPermission, setLocationPermission] = useState<
        "granted" | "denied" | "prompt" | null
    >(null);

    const { groups, filters, map: mapState, updateMapState } = useGroupStore();

    // Get user's current location
    const getUserLocation = () => {
        if (!navigator.geolocation) {
            setLocationPermission("denied");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setUserLocation(userPos);
                setLocationPermission("granted");

                // Update map center to user location
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.setCenter(userPos);
                    mapInstanceRef.current.setZoom(13); // Zoom in to show local area
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                setLocationPermission("denied");
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
            },
        );
    };

    // Filter groups based on current filters using FlexSearch
    const filteredGroups = useMemo(() => {
        // Start with search-filtered groups using FlexSearch
        let searchFilteredGroups = groups;
        if (filters.search) {
            searchFilteredGroups = groupSearchService.search(filters.search);
        }

        // Apply other filters to search results
        return searchFilteredGroups.filter((group) => {
            // Location filter
            if (filters.location && !filters.location.includes("All")) {
                if (group.campusLocation !== filters.location) return false;
            }

            // Day filter
            if (filters.day && !filters.day.includes("Any")) {
                if (group.meetingDay !== filters.day) return false;
            }

            // Time filter
            if (filters.time && !filters.time.includes("Any")) {
                if (group.meetingTime !== filters.time) return false;
            }

            // Type filter
            if (filters.type && filters.type !== "Mixed") {
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

                if (
                    !apiKey ||
                    apiKey.includes("your_google_maps_api_key_here")
                ) {
                    // Show fallback if no API key
                    setError("Google Maps API key not configured");
                    setIsLoading(false);
                    return;
                }

                // Check if Google Maps is already loaded
                if (typeof google !== "undefined" && google.maps) {
                    // Google Maps already loaded, initialize directly
                    initializeMap();
                } else {
                    // Load Google Maps
                    const loader = new Loader({
                        apiKey: apiKey,
                        version: "weekly",
                        libraries: ["marker", "geometry"],
                    });

                    await loader.load();
                    initializeMap();
                }

                function initializeMap() {
                    // Wait for mapRef to be available
                    const tryInitialize = () => {
                        if (mapRef.current && !mapInstanceRef.current) {
                            // Clear any existing content
                            mapRef.current.innerHTML = "";

                            const map = new google.maps.Map(mapRef.current, {
                                center: {
                                    lat: mapState.center.lat,
                                    lng: mapState.center.lng,
                                },
                                zoom: mapState.zoom,
                                styles: [
                                    {
                                        featureType: "poi",
                                        elementType: "labels",
                                        stylers: [{ visibility: "off" }],
                                    },
                                ],
                                mapTypeControl: false,
                                fullscreenControl: false,
                                streetViewControl: false,
                            });

                            mapInstanceRef.current = map;
                            setIsMapLoaded(true);

                            // Wait for tiles to load before hiding spinner
                            google.maps.event.addListenerOnce(
                                map,
                                "tilesloaded",
                                () => {
                                    setAreTilesLoaded(true);
                                    setIsLoading(false);
                                },
                            );

                            // Fallback timeout in case tilesloaded doesn't fire
                            setTimeout(() => {
                                if (!areTilesLoaded) {
                                    setAreTilesLoaded(true);
                                    setIsLoading(false);
                                }
                            }, 3000);

                            // Update store when map bounds change (debounced for performance)
                            let boundsUpdateTimeout: NodeJS.Timeout;
                            map.addListener("bounds_changed", () => {
                                clearTimeout(boundsUpdateTimeout);
                                boundsUpdateTimeout = setTimeout(() => {
                                    const center = map.getCenter();
                                    const zoom = map.getZoom();
                                    const bounds = map.getBounds();

                                    if (center && zoom) {
                                        updateMapState({
                                            center: {
                                                lat: center.lat(),
                                                lng: center.lng(),
                                            },
                                            zoom: zoom,
                                            bounds: bounds,
                                        });
                                    }
                                }, 300); // 300ms debounce
                            });

                            // Close info window when clicking on map (outside of markers)
                            map.addListener("click", () => {
                                if (currentInfoWindowRef.current) {
                                    currentInfoWindowRef.current.close();
                                    currentInfoWindowRef.current = null;
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
                console.error("Failed to initialize map:", err);
                setError("Failed to load Google Maps");
                setIsLoading(false);
            }
        };

        // Add a small delay to ensure the component is mounted
        const timer = setTimeout(initMap, 100);

        // Safety timeout to clear loading state if something goes wrong
        const safetyTimer = setTimeout(() => {
            setIsLoading(false);
        }, 8000); // 8 second timeout to account for slow tile loading

        return () => {
            clearTimeout(timer);
            clearTimeout(safetyTimer);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Update markers when filtered groups change
    useEffect(() => {
        if (!isMapLoaded || !mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.setMap(null));
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
                        fillColor: "#006acc", // C3 primary blue
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 2,
                    },
                });

                // Add info window
                const infoWindow = new google.maps.InfoWindow({
                    content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: var(--c3-text-primary); font-size: 16px; font-weight: 600;">
                ${group.name}
              </h3>
              <p style="margin: 0 0 8px 0; color: var(--c3-text-secondary); font-size: 14px; line-height: 1.4;">
                ${group.description.substring(0, 100)}${group.description.length > 100 ? "..." : ""}
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
          `,
                });

                marker.addListener("click", () => {
                    // Close any currently open info window
                    if (currentInfoWindowRef.current) {
                        currentInfoWindowRef.current.close();
                    }

                    // Open the new info window and track it
                    infoWindow.open(mapInstanceRef.current, marker);
                    currentInfoWindowRef.current = infoWindow;
                });

                // Clear reference when info window is closed
                infoWindow.addListener("closeclick", () => {
                    currentInfoWindowRef.current = null;
                });

                markersRef.current.push(marker);
            }
        });

        // Adjust map bounds to show all markers if there are any
        if (markersRef.current.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            markersRef.current.forEach((marker) => {
                const position = marker.getPosition();
                if (position) bounds.extend(position);
            });
            mapInstanceRef.current.fitBounds(bounds);
        }
    }, [filteredGroups, isMapLoaded]);

    // Handle user location updates
    useEffect(() => {
        if (!isMapLoaded || !mapInstanceRef.current || !userLocation) return;

        // Clear existing user location marker and radius
        if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setMap(null);
        }
        if (radiusCircleRef.current) {
            radiusCircleRef.current.setMap(null);
        }

        // Create user location marker
        const userMarker = new google.maps.Marker({
            position: userLocation,
            map: mapInstanceRef.current,
            title: "Your Location",
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4285F4", // Google Blue
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 3,
            },
        });

        // Create 10km radius circle
        const radiusCircle = new google.maps.Circle({
            center: userLocation,
            radius: 10000, // 10km in meters
            map: mapInstanceRef.current,
            fillColor: "#4285F4",
            fillOpacity: 0.1,
            strokeColor: "#4285F4",
            strokeOpacity: 0.3,
            strokeWeight: 2,
        });

        userLocationMarkerRef.current = userMarker;
        radiusCircleRef.current = radiusCircle;

        // Add info window for user location
        const infoWindow = new google.maps.InfoWindow({
            content: `
        <div style="padding: 8px; max-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: var(--c3-text-primary); font-size: 16px; font-weight: 600;">
            Your Location
          </h3>
          <p style="margin: 0; color: var(--c3-text-secondary); font-size: 14px;">
            Showing groups within 10km radius
          </p>
        </div>
      `,
        });

        userMarker.addListener("click", () => {
            // Close any currently open info window
            if (currentInfoWindowRef.current) {
                currentInfoWindowRef.current.close();
            }

            // Open the user location info window and track it
            infoWindow.open(mapInstanceRef.current, userMarker);
            currentInfoWindowRef.current = infoWindow;
        });

        // Clear reference when info window is closed
        infoWindow.addListener("closeclick", () => {
            currentInfoWindowRef.current = null;
        });
    }, [userLocation, isMapLoaded]);

    // Handle Escape key to close info window
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && currentInfoWindowRef.current) {
                currentInfoWindowRef.current.close();
                currentInfoWindowRef.current = null;
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []); // No dependencies needed as we use ref

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div
                    className="text-center p-6"
                    style={{ color: "var(--c3-text-secondary)" }}
                >
                    <div className="mb-4">
                        <svg
                            className="w-16 h-16 mx-auto text-gray-400"
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
                    <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: "var(--c3-text-primary)" }}
                    >
                        Map Unavailable
                    </h3>
                    <p className="text-sm mb-4">{error}</p>
                    <div className="mt-4 space-y-2 text-xs">
                        <div>
                            📍{" "}
                            {
                                groups.filter(
                                    (g) => g.campusLocation === "Downtown",
                                ).length
                            }{" "}
                            Downtown Groups
                        </div>
                        <div>
                            📍{" "}
                            {
                                groups.filter(
                                    (g) => g.campusLocation === "Midtown",
                                ).length
                            }{" "}
                            Midtown Groups
                        </div>
                        <div>
                            📍{" "}
                            {
                                groups.filter(
                                    (g) => g.campusLocation === "Hamilton",
                                ).length
                            }{" "}
                            Hamilton Groups
                        </div>
                    </div>
                    <p className="text-xs mt-4 opacity-75">
                        To enable the map, add your Google Maps API key to
                        .env.local
                    </p>
                </div>
            </div>
        );
    }

    return (
        <LoadingOverlay isLoading={isLoading} message="Loading map...">
            <div ref={mapRef} className="w-full h-full" />

            {/* Location button */}
            <button
                onClick={getUserLocation}
                disabled={locationPermission === "denied"}
                className="absolute top-4 right-4 bg-white shadow-lg rounded-lg p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: "var(--c3-border)" }}
                title={
                    locationPermission === "denied"
                        ? "Location access denied"
                        : "Find my location"
                }
            >
                <svg
                    className="w-5 h-5"
                    style={{
                        color:
                            locationPermission === "granted"
                                ? "var(--c3-primary-blue)"
                                : "var(--c3-text-secondary)",
                    }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* Location status indicator */}
            {locationPermission === "granted" && userLocation && (
                <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span style={{ color: "var(--c3-text-secondary)" }}>
                            Showing 10km radius
                        </span>
                    </div>
                </div>
            )}
        </LoadingOverlay>
    );
}
