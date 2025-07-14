"use client";

import { MapPin, Clock, Users, ExternalLink } from "lucide-react";
import { Group } from "@/types";
import Image from "next/image";

interface GroupCardProps {
    group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
    const timeMapping: Record<string, string> = {
        Morning: "9:00 AM",
        Afternoon: "2:00 PM",
        Evening: "7:00 PM",
    };

    const displayTime = timeMapping[group.meetingTime] || group.meetingTime;

    return (
        <div className="c3-card">
            {/* Group Image */}
            <div className="relative w-full h-48 mb-4 rounded-sm overflow-hidden">
                <Image
                    src={group.imageUrl || "/placeholder-group.jpg"}
                    loading="lazy"
                    alt={group.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!group.isOpen && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Full
                    </div>
                )}
            </div>

            {/* Group Info */}
            <div className="space-y-3">
                <h3
                    className="text-xl font-semibold"
                    style={{ color: "var(--c3-text-primary)" }}
                >
                    {group.name}
                </h3>

                <p
                    className="text-sm line-clamp-2"
                    style={{ color: "var(--c3-text-secondary)" }}
                >
                    {group.description}
                </p>

                {/* Metadata */}
                <div
                    className="space-y-2 text-sm"
                    style={{ color: "var(--c3-text-secondary)" }}
                >
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{group.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                            {group.meetingDay}s, {displayTime}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                            {group.groupType} • {group.currentMemberCount}/
                            {group.capacity} members
                        </span>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() =>
                        window.open(group.planningCenterUrl, "_blank")
                    }
                    className="c3-button-primary w-full flex items-center justify-center gap-2 mt-4"
                    disabled={!group.isOpen}
                >
                    <span>Learn More</span>
                    <ExternalLink className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
