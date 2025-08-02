"use client";

import { MapPin, Clock, ExternalLink } from "lucide-react";
import { Group } from "@/types";
import { useGroupStore } from "@/store/useGroupStore";
import Image from "next/image";

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const { ui, updateUIState } = useGroupStore();
  const isHovered = ui.hoveredGroup === group.id;
  const timeMapping: Record<string, string> = {
    Morning: "9:00 AM",
    Afternoon: "2:00 PM",
    Evening: "7:00 PM",
  };

  const displayTime = timeMapping[group.meetingTime] || group.meetingTime;

  const handleMouseEnter = () => {
    updateUIState({ hoveredGroup: group.id });
  };

  const handleMouseLeave = () => {
    updateUIState({ hoveredGroup: null });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Group Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={group.imageUrl || "/placeholder-group.jpg"}
          loading="lazy"
          alt={group.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!group.isOpen && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            FULL
          </div>
        )}
      </div>

      {/* Group Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-gray-900">{group.name}</h3>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {group.description}
        </p>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {group.meetingDay === "TBD" ? "TBD" : `${group.meetingDay}s`},{" "}
              {displayTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{group.location}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {group.groupType === "Men" && <span>♂</span>}
              {group.groupType === "Women" && <span>♀</span>}
              {group.groupType === "Mixed" && <span>⚥</span>}
              <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                {group.groupType}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => window.open(group.planningCenterUrl, "_blank")}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
          disabled={!group.isOpen}
        >
          LEARN MORE
        </button>
      </div>
    </div>
  );
}
