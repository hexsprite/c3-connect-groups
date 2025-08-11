import { create } from "zustand";
import { AppState, Group, GroupFilters, MapState, UIState } from "@/types";

const defaultFilters: GroupFilters = {
  search: "",
  location: "All Locations",
  day: "Any Day",
  time: "Any Time",
  type: "⚥ Mixed",
  groupType: "All Types",
};

const defaultMapState: MapState = {
  center: { lat: 43.6532, lng: -79.3832 }, // Toronto center
  zoom: 11,
};

const defaultUIState: UIState = {
  loading: false,
  view: "split",
  selectedGroup: null,
  hoveredGroup: null,
};

export const useGroupStore = create<AppState>((set) => ({
  groups: [],
  filters: defaultFilters,
  map: defaultMapState,
  ui: defaultUIState,

  setGroups: (groups: Group[]) => set({ groups }),

  updateFilters: (newFilters: Partial<GroupFilters>) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  updateMapState: (newMapState: Partial<MapState>) =>
    set((state) => ({
      map: { ...state.map, ...newMapState },
    })),

  updateUIState: (newUIState: Partial<UIState>) =>
    set((state) => ({
      ui: { ...state.ui, ...newUIState },
    })),

  clearFilters: () => set({ filters: defaultFilters }),
}));
