// Hand-written types matching supabase/schema.sql. If you change the
// schema, either update this file or generate it with:
//   npx supabase gen types typescript --project-id <id> > src/lib/types.ts

export type FuelType = 'benzine' | 'diesel' | 'elektrisch' | 'hybride' | 'lpg';
export type Transmission = 'handgeschakeld' | 'automaat';
export type ListingStatus = 'draft' | 'active' | 'reserved' | 'sold';
export type Department = 'verkoop' | 'oldtimer';

export interface Car {
  id: string;
  make: string;
  model: string;
  build_year: number;
  vin: string | null;
  mileage_km: number | null;
  fuel_type: FuelType | null;
  transmission: Transmission | null;
  is_oldtimer: boolean;
  description: string | null;
  created_at: string;
}

export interface Listing {
  id: string;
  car_id: string;
  seller_id: string;
  department: Department;
  price_cents: number;
  currency: string;
  status: ListingStatus;
  slug: string | null;
  listed_at: string | null;
  created_at: string;
}

export interface ListingWithCar extends Listing {
  cars: Car;
}

export interface RestorationEvent {
  id: string;
  car_id: string;
  event_date: string;
  title: string;
  description: string | null;
  cost_cents: number | null;
  performed_by: string | null;
}

export interface BumprProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  size_ml: number | null;
  is_bundle: boolean;
  bundle_of: string[] | null;
  image_url: string | null;
  sort_order: number;
}

export interface Inquiry {
  listing_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
}

export interface CarWashBooking {
  name: string;
  email: string;
  phone: string | null;
  address: string;
  requested_date: string | null;
  notes: string | null;
}

export interface WorkshopBooking {
  name: string;
  email: string;
  phone: string | null;
  service_type: string | null;
  requested_date: string | null;
  notes: string | null;
}

// Minimal Database shape so @supabase/ssr's generics are satisfied.
// Expand per-table `Row`/`Insert`/`Update` shapes if you adopt the
// generated-types workflow above.
export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
};
