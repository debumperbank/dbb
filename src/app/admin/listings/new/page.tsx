import { createListing } from '../actions';

const inputClass =
  'bg-bg border border-[color:var(--line-dark)] rounded-[3px] px-4 py-2.5 text-sm placeholder:text-muted focus:outline-none focus:border-orange w-full';

export default function NewListingPage() {
  return (
    <div className="max-w-xl">
      <div className="eyebrow mb-2"><span className="dot" />Beheer</div>
      <h1 className="text-2xl mb-8">Nieuwe wagen toevoegen</h1>

      <form action={createListing} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <input required name="make" placeholder="Merk" className={inputClass} />
          <input required name="model" placeholder="Model" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input required type="number" name="build_year" placeholder="Bouwjaar" className={inputClass} />
          <input type="number" name="mileage_km" placeholder="Kilometerstand" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select name="fuel_type" className={inputClass} defaultValue="">
            <option value="" disabled>Brandstof</option>
            <option value="benzine">Benzine</option>
            <option value="diesel">Diesel</option>
            <option value="elektrisch">Elektrisch</option>
            <option value="hybride">Hybride</option>
            <option value="lpg">LPG</option>
          </select>
          <select name="transmission" className={inputClass} defaultValue="">
            <option value="" disabled>Transmissie</option>
            <option value="handgeschakeld">Handgeschakeld</option>
            <option value="automaat">Automaat</option>
          </select>
        </div>
        <textarea name="description" placeholder="Beschrijving" rows={4} className={inputClass} />
        <div className="grid grid-cols-2 gap-4">
          <input required type="number" step="0.01" name="price_euro" placeholder="Prijs (EUR)" className={inputClass} />
          <select name="department" className={inputClass} defaultValue="verkoop">
            <option value="verkoop">Verkoop</option>
            <option value="oldtimer">Oldtimer</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <select name="status" className={inputClass} defaultValue="draft">
            <option value="draft">Concept</option>
            <option value="active">Actief</option>
            <option value="reserved">Gereserveerd</option>
            <option value="sold">Verkocht</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-muted font-mono">
            <input type="checkbox" name="is_oldtimer" className="accent-orange" />
            Oldtimer
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-fit mt-2">Wagen opslaan</button>
      </form>
    </div>
  );
}
