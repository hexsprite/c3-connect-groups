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
      className={`c3-card transition-all duration-300 ${
        isHovered ? "scale-105 shadow-xl" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Group Image */}
      <div className="relative w-full h-56 mb-6 rounded-lg overflow-hidden">
        <Image
          src={group.imageUrl || "/placeholder-group.jpg"}
          loading="lazy"
          alt={group.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!group.isOpen && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Full
          </div>
        )}
      </div>

      {/* Group Info */}
      <div className="space-y-4">
        <h3
          className="c3-heading c3-heading-sm mb-3"
          style={{ color: "var(--c3-text-primary)" }}
        >
          {group.name}
        </h3>

        <p
          className="c3-text-sm line-clamp-3"
          style={{ color: "var(--c3-text-secondary)" }}
        >
          {group.description}
        </p>

        {/* Metadata */}
        <div
          className="space-y-3 c3-text-sm"
          style={{ color: "var(--c3-text-secondary)" }}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{group.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>
                {group.meetingDay === "TBD" ? "TBD" : `${group.meetingDay}s`},{" "}
                {displayTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {group.groupType === "Men" && <span className="text-sm">♂</span>}
              {group.groupType === "Women" && (
                <span className="text-sm">♀</span>
              )}
              {group.groupType === "Mixed" && (
                <span className="text-sm">⚥</span>
              )}
              <span
                className="c3-text-xs font-medium px-2 py-1 bg-gray-100 rounded-full"
                style={{ color: "var(--c3-text-secondary)" }}
              >
                {group.groupType}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => window.open(group.planningCenterUrl, "_blank")}
          className="c3-button-primary w-full mt-6"
          disabled={!group.isOpen}
        >
          <span>Learn More</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
