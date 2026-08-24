'use client';

import { useRef, useTransition } from 'react';
import { uploadListingPhoto, deleteListingPhoto, addRestorationEvent } from '../actions';

export function PhotoUploadForm({ listingId }: { listingId: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) =>
        startTransition(async () => {
          await uploadListingPhoto(listingId, formData);
          formRef.current?.reset();
        })
      }
      className="flex items-center gap-3"
    >
      <input
        required
        type="file"
        name="photo"
        accept="image/*"
        className="text-xs text-muted font-mono file:mr-3 file:py-2 file:px-3 file:rounded-[3px] file:border-0 file:bg-bg-soft-2 file:text-paper file:text-xs file:font-mono"
      />
      <button type="submit" disabled={isPending} className="btn btn-ghost text-xs disabled:opacity-60">
        {isPending ? 'Uploaden…' : 'Uploaden'}
      </button>
    </form>
  );
}

export function DeletePhotoButton({ photoId, listingId }: { photoId: string; listingId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => deleteListingPhoto(photoId, listingId))}
      className="absolute top-1.5 right-1.5 bg-bg/80 text-orange-bright text-[10px] font-mono px-1.5 py-0.5 rounded-[2px]"
    >
      ✕
    </button>
  );
}

export function RestorationEventForm({ carId, listingId }: { carId: string; listingId: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const inputClass =
    'bg-bg border border-[color:var(--line-dark)] rounded-[3px] px-3 py-2 text-xs placeholder:text-muted focus:outline-none focus:border-orange w-full';

  return (
    <form
      ref={formRef}
      action={(formData) =>
        startTransition(async () => {
          await addRestorationEvent(carId, listingId, formData);
          formRef.current?.reset();
        })
      }
      className="grid gap-2.5 mt-4"
    >
      <div className="grid grid-cols-2 gap-2.5">
        <input required type="date" name="event_date" className={inputClass} />
        <input required name="title" placeholder="Titel" className={inputClass} />
      </div>
      <textarea name="description" placeholder="Beschrijving" rows={2} className={inputClass} />
      <input name="performed_by" placeholder="Uitgevoerd door" className={inputClass} />
      <button type="submit" disabled={isPending} className="btn btn-ghost text-xs w-fit disabled:opacity-60">
        {isPending ? 'Bezig…' : '+ Dossierpost toevoegen'}
      </button>
    </form>
  );
}
