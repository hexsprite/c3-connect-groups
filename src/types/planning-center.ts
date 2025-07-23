// Planning Center API Response Types

export interface PlanningCenterGroup {
  id: string;
  type: 'Group';
  attributes: {
    name: string;
    description: string;
    location_type_preference: string;
    memberships_count: number;
    group_type: string;
    public_church_center_web_url: string;
    enrollment: 'open' | 'closed' | 'closed_to_new_members';
    schedule: string;
    contact_email: string;
    header_image: {
      original: string;
      medium: string;
      thumbnail: string;
    };
    virtual_location_url?: string;
    created_at: string;
    updated_at: string;
  };
  relationships: {
    location: {
      data: {
        type: 'Location';
        id: string;
      } | null;
    };
    group_type: {
      data: {
        type: 'GroupType';
        id: string;
      } | null;
    };
    events: {
      data: Array<{
        type: 'Event';
        id: string;
      }>;
    };
  };
}

export interface PlanningCenterLocation {
  id: string;
  type: 'Location';
  attributes: {
    display_preference: string;
    full_formatted_address: string;
    latitude: number;
    longitude: number;
    name: string;
    radius: number;
    strategy: string;
    created_at: string;
    updated_at: string;
  };
}

export interface PlanningCenterGroupType {
  id: string;
  type: 'GroupType';
  attributes: {
    name: string;
    description: string;
    color_identifier: string;
    default_group_settings: unknown;
    created_at: string;
    updated_at: string;
  };
}

export interface PlanningCenterEvent {
  id: string;
  type: 'Event';
  attributes: {
    attendance_requests_enabled: boolean;
    automated_reminder_enabled: boolean;
    canceled: boolean;
    description: string;
    ends_at: string;
    location_type_preference: string;
    multi_day: boolean;
    name: string;
    reminder_sent: boolean;
    repeating: boolean;
    starts_at: string;
    virtual_location_url?: string;
    created_at: string;
    updated_at: string;
  };
  relationships: {
    location: {
      data: {
        type: 'Location';
        id: string;
      } | null;
    };
  };
}

export interface PlanningCenterApiResponse<T> {
  data: T[];
  included?: Array<PlanningCenterLocation | PlanningCenterGroupType | PlanningCenterEvent>;
  links: {
    self: string;
    next?: string;
    prev?: string;
  };
  meta: {
    total_count: number;
    count: number;
    next?: {
      offset: number;
    };
    prev?: {
      offset: number;
    };
    can_order_by: string[];
    can_query_by: string[];
    can_include: string[];
    can_filter: string[];
    parent: {
      id: string;
      type: string;
    };
  };
}

// Rate limiting interface
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: number;
}

// Error types
export interface PlanningCenterError {
  title: string;
  detail: string;
  code: string;
  status: string;
  source?: {
    pointer: string;
  };
}

export interface PlanningCenterErrorResponse {
  errors: PlanningCenterError[];
}