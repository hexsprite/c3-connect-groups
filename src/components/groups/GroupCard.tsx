"use client";

import { MapPin, Clock, ExternalLink, Users, Star } from "lucide-react";
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

  // Calculate capacity info
  const capacity = group.capacity || 12;
  const currentMembers = group.currentMemberCount || 8;
  const spotsLeft = capacity - currentMembers;
  const isNew = Math.random() > 0.7; // 30% chance of being "new"

  // Group type mapping - simplified titles only
  const groupTypes = [
    "Sermon-based",
    "Activity-based",
    "How To Read The Bible",
    "Love This City",
    "Alpha Pre-Marriage",
    "Alpha Marriage",
    "Alpha",
    "Finding Freedom",
  ];

  const randomGroupType =
    groupTypes[Math.floor(Math.random() * groupTypes.length)];

  // Multiple leaders (2-4 leaders)
  const leaders = [
    { name: "Sarah Mitchell", initials: "SM" },
    { name: "David Chen", initials: "DC" },
    { name: "Emily Rodriguez", initials: "ER" },
    { name: "Michael Thompson", initials: "MT" },
  ];
  const numLeaders = Math.floor(Math.random() * 3) + 2; // 2-4 leaders
  const groupLeaders = leaders.slice(0, numLeaders);

  const handleMouseEnter = () => {
    updateUIState({ hoveredGroup: group.id });
  };

  const handleMouseLeave = () => {
    updateUIState({ hoveredGroup: null });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
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

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {!group.isOpen && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              FULL
            </div>
          )}
          {isNew && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              NEW
            </div>
          )}
        </div>

        {/* Capacity Indicator */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>
            {currentMembers}/{capacity}
          </span>
        </div>
      </div>

      {/* Group Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 flex-1">
            {group.name}
          </h3>
          {group.isOpen && spotsLeft <= 3 && (
            <div className="text-orange-600 text-xs font-bold bg-orange-100 px-2 py-1 rounded-full">
              {spotsLeft} SPOTS LEFT
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          {group.description}
        </p>

        {/* Group Type */}
        <div className="mb-4">
          <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {randomGroupType}
          </span>
        </div>

        {/* Multiple Leaders Information */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="mb-2">
            <div className="text-xs font-medium text-gray-600 mb-2">
              Group Leaders
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {groupLeaders.map((leader, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {leader.initials}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-900">
                  {leader.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>
              {group.meetingDay === "TBD" ? "TBD" : `${group.meetingDay}s`},{" "}
              {displayTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{group.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>
              {group.groupType} Group • {capacity} max
            </span>
          </div>
        </div>

        {/* Group Type Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {group.groupType === "Men" && <span>♂</span>}
            {group.groupType === "Women" && <span>♀</span>}
            {group.groupType === "Mixed" && <span>⚥</span>}
            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
              {group.groupType}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => window.open(group.planningCenterUrl, "_blank")}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          disabled={!group.isOpen}
        >
          {group.isOpen ? "REGISTER HERE" : "GROUP FULL"}
        </button>
      </div>
    </div>
  );
}
