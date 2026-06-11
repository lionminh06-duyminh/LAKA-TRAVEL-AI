export type VibeType = 'Chill' | 'Foodie' | 'Indie' | 'Maximalism' | 'Nightlife';

export interface RequirementState {
  days: number;
  budget: 'economy' | 'moderate' | 'luxury';
  companions: 'solo' | 'couple' | 'friends' | 'family';
  pace: 'relaxed' | 'balanced' | 'fast';
  priorities: string[];
}

export interface Activity {
  title: string;
  description: string;
  location: string;
  timeOfDay: 'Morning' | 'Noon' | 'Afternoon' | 'Evening';
  approxCost: string;
  tip: string;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

export interface Itinerary {
  destination: string;
  vibe: VibeType;
  days: number;
  budget: string;
  title: string;
  tagline: string;
  estimatedTotal: string;
  daysPlan: DayPlan[];
  genZRecommendations: string[];
  localSlangs: { word: string; meaning: string }[];
}

export interface SavedTrip {
  id: string;
  destination: string;
  vibe: VibeType;
  days: number;
  itinerary: Itinerary;
  createdAt: string;
  completed: boolean;
}

export interface UserStats {
  tripsCount: number;
  unlockedVibes: VibeType[];
  scannedStamps: string[]; // List of destinations where user has a passport stamp
  vouchersClaimed: string[]; // Voucher IDs
}

export interface Voucher {
  id: string;
  code: string;
  partnerName: string;
  discount: string;
  vibeRequired: VibeType;
  claimed: boolean;
  description: string;
  logo: string;
}
