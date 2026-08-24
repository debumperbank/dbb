'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function createListing(formData: FormData) {
  const supabase = await createAdminClient();

  const make = String(formData.get('make') ?? '');
  const model = String(formData.get('model') ?? '');
  const buildYear = Number(formData.get('build_year'));
  const mileageKm = formData.get('mileage_km') ? Number(formData.get('mileage_km')) : null;
  const fuelType = String(formData.get('fuel_type') ?? '') || null;
  const transmission = String(formData.get('transmission') ?? '') || null;
  const isOldtimer = formData.get('is_oldtimer') === 'on';
  const description = String(formData.get('description') ?? '') || null;
  const priceEuro = Number(formData.get('price_euro') ?? 0);
  const department = String(formData.get('department') ?? 'verkoop');
  const status = String(formData.get('status') ?? 'draft');

  const { data: car, error: carError } = await supabase
    .from('cars')
    .insert({
      make,
      model,
      build_year: buildYear,
      mileage_km: mileageKm,
      fuel_type: fuelType,
      transmission,
      is_oldtimer: isOldtimer,
      description,
    })
    .select('id')
    .single();

  if (carError || !car) {
    throw new Error(carError?.message ?? 'Kon auto niet aanmaken');
  }

  const { data: seller } = await supabase.from('sellers').select('id').limit(1).single();

  const slugBase = slugify(`${make}-${model}-${buildYear}`);
  const slug = `${slugBase}-${car.id.slice(0, 6)}`;

  const { error: listingError } = await supabase.from('listings').insert({
    car_id: car.id,
    seller_id: seller?.id,
    department,
    price_cents: Math.round(priceEuro * 100),
    status,
    slug,
    listed_at: status === 'active' ? new Date().toISOString() : null,
  });

  if (listingError) {
    throw new Error(listingError.message);
  }

  revalidatePath('/admin/listings');
  revalidatePath('/voorraad');
  revalidatePath('/');
  redirect('/admin/listings');
}

export async function updateListingStatus(listingId: string, status: string) {
  const supabase = createAdminClient();
  await supabase
    .from('listings')
    .update({ status, listed_at: status === 'active' ? new Date().toISOString() : undefined })
    .eq('id', listingId);

  revalidatePath('/admin/listings');
  revalidatePath('/voorraad');
  revalidatePath('/');
}

export async function deleteListing(listingId: string, carId: string) {
  const supabase = createAdminClient();
  // Deleting the car cascades to the listing (foreign key on delete cascade).
  await supabase.from('cars').delete().eq('id', carId);
  revalidatePath('/admin/listings');
  revalidatePath('/voorraad');
  revalidatePath('/');
}

export async function addRestorationEvent(carId: string, listingId: string, formData: FormData) {
  const supabase = createAdminClient();
  const eventDate = String(formData.get('event_date') ?? '');
  const title = String(formData.get('title') ?? '');
  const description = String(formData.get('description') ?? '') || null;
  const performedBy = String(formData.get('performed_by') ?? '') || null;

  await supabase.from('restoration_events').insert({
    car_id: carId,
    event_date: eventDate,
    title,
    description,
    performed_by: performedBy,
  });

  revalidatePath(`/admin/listings/${listingId}`);
}

export async function uploadListingPhoto(listingId: string, formData: FormData) {
  const supabase = createAdminClient();
  const file = formData.get('photo') as File | null;
  if (!file || file.size === 0) return;

  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${listingId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('listing-photos')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrl } = supabase.storage.from('listing-photos').getPublicUrl(path);

  await supabase.from('listing_photos').insert({
    listing_id: listingId,
    url: publicUrl.publicUrl,
    sort_order: 0,
  });

  revalidatePath(`/admin/listings/${listingId}`);
}

export async function deleteListingPhoto(photoId: string, listingId: string) {
  const supabase = createAdminClient();
  await supabase.from('listing_photos').delete().eq('id', photoId);
  revalidatePath(`/admin/listings/${listingId}`);
}
