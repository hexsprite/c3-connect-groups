// Planning Center API Types
export interface Group {
  id: string;
  name: string;
  description: string;
  location: string;
  meetingDay: string;
  meetingTime: string;
  groupType: "Mixed" | "Men" | "Women";
  capacity?: number;
  currentMemberCount?: number;
  isOpen: boolean;
  imageUrl?: string;
  planningCenterUrl: string;
  latitude?: number;
  longitude?: number;
  campusLocation: "Downtown" | "Midtown" | "Hamilton";
}

// Filter Types
export interface GroupFilters {
  search: string;
  location: string;
  day: string;
  time: string;
  type: string;
  groupType: string;
}

// Map Types
export interface MapState {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  bounds?: google.maps.LatLngBounds | null; // Will be properly typed when Google Maps loads
}

// UI State Types
export interface UIState {
  loading: boolean;
  view: "split" | "list" | "map";
  selectedGroup: string | null;
  hoveredGroup: string | null;
}

// Store Types
export interface AppState {
  groups: Group[];
  filters: GroupFilters;
  map: MapState;
  ui: UIState;

  // Actions
  setGroups: (groups: Group[]) => void;
  updateFilters: (filters: Partial<GroupFilters>) => void;
  updateMapState: (mapState: Partial<MapState>) => void;
  updateUIState: (uiState: Partial<UIState>) => void;
  clearFilters: () => void;
}
