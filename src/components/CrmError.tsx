export function CrmError() {
  return (
    <div className="panel" role="alert">
      <h2 className="text-xl">Het overzicht kan nog niet worden geladen.</h2>
      <p className="text-muted mt-3">
        Controleer de databaseverbinding en of migratie 003_mobile_crm.sql is
        uitgevoerd. Bestaande voorraad en boekingen blijven bereikbaar via het
        menu.
      </p>
    </div>
  );
}
