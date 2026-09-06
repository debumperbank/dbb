import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPriceCents } from '@/lib/format';
import type { ListingWithCar, RestorationEvent, RestorationEventPhoto } from '@/lib/types';
import {
  PhotoUploadForm,
  DeletePhotoButton,
  RestorationEventForm,
  DossierPhotoUpload,
  DeleteDossierPhotoButton,
} from './listing-editor-client';

interface Photo {
  id: string;
  url: string;
}

async function getListing(id: string) {
  const supabase = createAdminClient();
  const { data: listing } = await supabase
    .from('listings')
    .select('*, cars(*)')
    .eq('id', id)
    .maybeSingle();

  if (!listing) return null;

  const carId = (listing as unknown as ListingWithCar).car_id;

  const [{ data: photos }, { data: history }] = await Promise.all([
    supabase.from('listing_photos').select('id, url').eq('listing_id', id).order('sort_order'),
    supabase.from('restoration_events').select('*').eq('car_id', carId).order('event_date'),
  ]);

  const eventIds = (history ?? []).map((ev) => ev.id);
  let dossierPhotos: RestorationEventPhoto[] = [];
  if (eventIds.length > 0) {
    const { data } = await supabase
      .from('restoration_event_photos')
      .select('*')
      .in('restoration_event_id', eventIds)
      .order('sort_order');
    dossierPhotos = (data ?? []) as RestorationEventPhoto[];
  }

  return {
    listing: listing as unknown as ListingWithCar,
    photos: (photos ?? []) as Photo[],
    history: (history ?? []) as RestorationEvent[],
    dossierPhotos,
  };
}

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getListing(id);
  if (!result) notFound();

  const { listing, photos, history, dossierPhotos } = result;
  const { cars: car } = listing;

  return (
    <div className="max-w-2xl">
      <div className="eyebrow mb-2"><span className="dot" />Beheer</div>
      <h1 className="text-2xl mb-1">{car.make} {car.model}</h1>
      <p className="text-muted font-mono text-sm mb-8">
        {car.build_year} &middot; {listing.department} &middot; {formatPriceCents(listing.price_cents)} &middot; status: {listing.status}
      </p>

      <section className="mb-10">
        <h2 className="text-lg mb-4">Foto&apos;s</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
          {photos.map((p) => (
            <div key={p.id} className="relative aspect-square rounded-[3px] overflow-hidden border border-[color:var(--line-dark)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" className="w-full h-full object-cover" />
              <DeletePhotoButton photoId={p.id} listingId={listing.id} />
            </div>
          ))}
          {photos.length === 0 && (
            <p className="col-span-full text-muted text-sm font-mono">Nog geen foto&apos;s.</p>
          )}
        </div>
        <PhotoUploadForm listingId={listing.id} />
      </section>

      {car.is_oldtimer && (
        <section>
          <h2 className="text-lg mb-4">Restauratiedossier</h2>
          <div className="grid gap-5 mb-2">
            {history.map((ev) => {
              const evPhotos = dossierPhotos.filter((p) => p.restoration_event_id === ev.id);
              return (
                <div key={ev.id} className="border-l border-[color:var(--line-dark)] pl-4">
                  <div className="font-mono text-[11px] text-orange">{ev.event_date}</div>
                  <div className="text-sm font-semibold">{ev.title}</div>
                  {ev.description && <p className="text-xs text-muted mt-0.5">{ev.description}</p>}

                  {evPhotos.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
                      {evPhotos.map((p) => (
                        <div key={p.id} className="relative aspect-square rounded-[3px] overflow-hidden border border-[color:var(--line-dark)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.url} alt="" className="w-full h-full object-cover" />
                          <DeleteDossierPhotoButton photoId={p.id} listingId={listing.id} />
                        </div>
                      ))}
                    </div>
                  )}
                  <DossierPhotoUpload eventId={ev.id} listingId={listing.id} />
                </div>
              );
            })}
            {history.length === 0 && (
              <p className="text-muted text-sm font-mono">Nog geen dossierposten.</p>
            )}
          </div>
          <RestorationEventForm carId={car.id} listingId={listing.id} />
        </section>
      )}
    </div>
  );
}
