/**
 * CampusPulse Telemetry Type Definitions
 */

export type ResourceType = 'electricity' | 'water';
export type OccupancyStatus = 'occupied' | 'unoccupied';
export type DayType = 'weekday' | 'weekend';
export type AnomalySeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type AnomalyStatus = 'New' | 'Investigating' | 'Resolved';

export interface TelemetryRecord {
  id: string;
  timestamp: string;
  building_name: string;
  meter_id: string;
  resource_type: ResourceType;
  consumption: number;
  expected_baseline: number;
  unit: string;
  occupancy_status: OccupancyStatus;
  day_type: DayType;
}

export interface AnomalyRecord {
  id: string;
  timestamp: string;
  building: string;
  meter_id: string;
  resource: ResourceType;
  value: number;
  expected: number;
  excess: number;
  unit: string;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  evidence: string;
}

export interface GlobalFilters {
  dateRange: 'TODAY' | '7D' | '14D' | 'ALL';
  building: string;
  resource: 'ALL' | ResourceType;
  dayType: 'ALL' | DayType;
  occupancy: 'ALL' | OccupancyStatus;
}

export interface TariffSettings {
  electricity: number;
  water: number;
  recoveryRate: number;
}

export interface FinancialImpactMetrics {
  totalElectricity: number;
  excessElectricity: number;
  totalWater: number;
  excessWater: number;
  financialLoss: number;
  savingsTarget: number;
  annualSavings: number;
  efficiencyScore: number;
}

export interface EsgImpactMetrics {
  co2AvoidedKg: number;
  waterSavedLiters: number;
  treesEquivalent: number;
  reportDate: string;
  executiveSummary: string;
}

export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  role: string;
  institution: string;
  authenticatedAt: string;
}
