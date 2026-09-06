import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ContactForm } from '@/components/ContactForm';
import { PhotoCarousel } from '@/components/PhotoCarousel';
import { formatPriceCents, formatMileage } from '@/lib/format';
import type { ListingWithCar, ListingPhoto, RestorationEvent, RestorationEventPhoto } from '@/lib/types';

export const revalidate = 60;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getListing(idOrSlug: string): Promise<ListingWithCar | null> {
  const supabase = await createClient();
  const query = supabase.from('listings').select('*, cars(*)');
  const { data, error } = UUID_RE.test(idOrSlug)
    ? await query.eq('id', idOrSlug).maybeSingle()
    : await query.eq('slug', idOrSlug).maybeSingle();

  if (error || !data) return null;
  return data as unknown as ListingWithCar;
}

async function getListingPhotos(listingId: string): Promise<ListingPhoto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('listing_photos')
    .select('*')
    .eq('listing_id', listingId)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];
  return data as ListingPhoto[];
}

async function getRestorationHistory(carId: string): Promise<{
  events: RestorationEvent[];
  photosByEvent: Record<string, RestorationEventPhoto[]>;
}> {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from('restoration_events')
    .select('*')
    .eq('car_id', carId)
    .order('event_date', { ascending: true });

  if (error || !events || events.length === 0) {
    return { events: [], photosByEvent: {} };
  }

  const { data: photos } = await supabase
    .from('restoration_event_photos')
    .select('*')
    .in('restoration_event_id', events.map((e) => e.id))
    .order('sort_order');

  const photosByEvent: Record<string, RestorationEventPhoto[]> = {};
  for (const photo of (photos ?? []) as RestorationEventPhoto[]) {
    (photosByEvent[photo.restoration_event_id] ??= []).push(photo);
  }

  return { events: events as RestorationEvent[], photosByEvent };
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const { cars: car } = listing;
  const { events: history, photosByEvent } = car.is_oldtimer
    ? await getRestorationHistory(car.id)
    : { events: [], photosByEvent: {} };
  const photos = await getListingPhotos(listing.id);

  return (
    <main className="px-8 py-20 bg-bg min-h-screen">
      <div className="max-w-site mx-auto grid md:grid-cols-[1.2fr_0.8fr] gap-14">
        <div>
          <div className="eyebrow"><span className="dot" />{car.build_year} &middot; {listing.department}</div>
          <h1 className="mt-3 text-3xl md:text-4xl">{car.make} {car.model}</h1>
          <div className="mt-5 font-display text-2xl text-orange">{formatPriceCents(listing.price_cents)}</div>

          <dl className="mt-8 grid grid-cols-2 gap-5 font-mono text-sm">
            <div>
              <dt className="text-muted text-[11px] uppercase">Kilometerstand</dt>
              <dd className="mt-1">{formatMileage(car.mileage_km)}</dd>
            </div>
            <div>
              <dt className="text-muted text-[11px] uppercase">Brandstof</dt>
              <dd className="mt-1">{car.fuel_type ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted text-[11px] uppercase">Transmissie</dt>
              <dd className="mt-1">{car.transmission ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-muted text-[11px] uppercase">Bouwjaar</dt>
              <dd className="mt-1">{car.build_year}</dd>
            </div>
          </dl>

          {car.description && (
            <p className="mt-8 text-[15px] leading-relaxed text-muted max-w-[60ch]">{car.description}</p>
          )}

          {history.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl mb-5">Restauratiedossier</h2>
              <div className="border-l border-[color:var(--line-dark)] pl-6 grid gap-6">
                {history.map((ev) => {
                  const evPhotos = photosByEvent[ev.id] ?? [];
                  return (
                    <div key={ev.id}>
                      <div className="font-mono text-[11px] text-orange">{ev.event_date}</div>
                      <h3 className="text-[15px] font-semibold mt-1">{ev.title}</h3>
                      {ev.description && <p className="text-sm text-muted mt-1">{ev.description}</p>}
                      {evPhotos.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3 max-w-md">
                          {evPhotos.map((p) => (
                            <div key={p.id} className="aspect-square rounded-[3px] overflow-hidden border border-[color:var(--line-dark)]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.url} alt={ev.title} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {photos.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl mb-5">Foto&apos;s</h2>
              <PhotoCarousel photos={photos} altPrefix={`${car.make} ${car.model}`} />
            </div>
          )}
        </div>

        <div className="bg-bg-soft border border-[color:var(--line-dark)] rounded-lg p-7 h-fit">
          <h2 className="text-lg mb-4">Interesse in deze wagen?</h2>
          <ContactForm listingId={listing.id} />
        </div>
      </div>
    </main>
  );
}