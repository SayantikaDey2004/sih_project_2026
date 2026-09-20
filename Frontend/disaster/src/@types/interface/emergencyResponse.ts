export type IncidentStatus = "Active" | "Monitoring" | "Resolved";
export type IncidentSeverity = "Critical" | "High" | "Moderate";
export type InfrastructureStatus = "Operational" | "Compromised" | "Offline";
export type HelpCategory = "Medical" | "Shelter" | "Food & Water" | "Rescue";

export interface Incident {
  id: string;
  name: string;
  location: string;
  severity: number;
  severityLabel: IncidentSeverity;
  status: IncidentStatus;
  detail: string;
  updatedAt: string;
}

export interface Village {
  id: string;
  name: string;
  distance?: string | null;
  affected: number;
  capacity: number;
  needs: string[];
  progress: number;
}

export interface Infrastructure {
  id: string;
  name: string;
  location: string;
  status: InfrastructureStatus;
  statusDetail: string;
}

export interface HelpEntry {
  id: string;
  category: HelpCategory;
  title: string;
  contact: string;
  availability: string;
  location?: string | null;
  distance?: string | null;
}

export interface Resource {
  id: string;
  name: string;
  allocated: number;
  total: number;
  unit: string;
}

export interface FeedItem {
  id: string;
  time: string;
  text: string;
  type: "alert" | "dispatch" | "update" | "system";
}

export interface EmergencyResponseData {
  user_location?: string;
  network_location?: string;
  incidents: Incident[];
  villages: Village[];
  infrastructure: Infrastructure[];
  helpEntries: HelpEntry[];
  resources: Resource[];
  feed: FeedItem[];
}

