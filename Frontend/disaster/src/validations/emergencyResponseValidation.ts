import { z } from "zod";

export const incidentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  location: z.string().min(1),
  severity: z.number().min(0).max(100),
  severityLabel: z.enum(["Critical", "High", "Moderate"]),
  status: z.enum(["Active", "Monitoring", "Resolved"]),
  detail: z.string(),
  updatedAt: z.string().min(1),
});

export const villageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  distance: z.string().nullable().optional(),
  affected: z.number().int().nonnegative(),
  capacity: z.number().int().positive(),
  needs: z.array(z.string().min(1)),
  progress: z.number().min(0).max(100),
});

export const infrastructureSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  location: z.string().min(1),
  status: z.enum(["Operational", "Compromised", "Offline"]),
  statusDetail: z.string(),
});

export const resourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  allocated: z.number().nonnegative(),
  total: z.number().positive(),
  unit: z.string().min(1),
});

export const feedItemSchema = z.object({
  id: z.string().min(1),
  time: z.string().min(1),
  text: z.string().min(1),
  type: z.enum(["alert", "dispatch", "update", "system"]),
});

export const helpEntrySchema = z.object({
  id: z.string().min(1),
  category: z.enum(["Medical", "Shelter", "Food & Water", "Rescue"]),
  title: z.string().min(1),
  contact: z.string().min(1),
  availability: z.string().min(1),
  location: z.string().nullable().optional(),
  distance: z.string().nullable().optional(),
});

export const emergencyResponseSchema = z.object({
  user_location: z.string().optional(),
  network_location: z.string().optional(),
  incidents: z.array(incidentSchema),
  villages: z.array(villageSchema),
  infrastructure: z.array(infrastructureSchema),
  helpEntries: z.array(helpEntrySchema),
  resources: z.array(resourceSchema),
  feed: z.array(feedItemSchema),
});

export type IncidentInput = z.infer<typeof incidentSchema>;
export type VillageInput = z.infer<typeof villageSchema>;
export type ResourceInput = z.infer<typeof resourceSchema>;
export type FeedItemInput = z.infer<typeof feedItemSchema>;
