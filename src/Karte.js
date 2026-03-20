import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import stellplaetze from "./stellplaetze";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function Karte({ profil }) {
  const gefilterteplaetze = stellplaetze.filter((platz) => {
    if (!platz.typ.includes(profil.typ)) return false;
    if (!platz.uebernachtung.includes(profil.uebernachtung)) return false;
    if (profil.laenge && platz.maxLaenge && parseFloat(profil.laenge) > platz.maxLaenge) return false;
    if (profil.hoehe && platz.maxHoehe && parseFloat(profil.hoehe) > platz.maxHoehe) return false;
    return true;
  });

  if (gefilterteplaetze.length === 0) {
    return (
      <div style={{
        height: "calc(100vh - 60px)", display: "flex",
        flexDirection: "column", alignItems: "center",
        justifyContent: "center", color: "#a0a0c0",
        backgroundColor: "#1a1a2e"
      }}>
        <p style={{ fontSize: "2rem" }}>😕</p>
        <p>Keine passenden Plätze gefunden.</p>
        <p style={{ fontSize: "0.8rem", color: "#606080" }}>
          Versuche andere Filter oder ein kleineres Fahrzeug.
        </p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[46.8, 8.2]}
      zoom={8}
      style={{ width: "100%", height: "calc(100vh - 60px)" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />
      {gefilterteplaetze.map((platz) => (
        <Marker key={platz.id} position={[platz.lat, platz.lng]}>
          <Popup>
            <div style={{ minWidth: "180px" }}>
              <p style={{ fontWeight: "bold", margin: "0 0 4px", fontSize: "14px" }}>
                {platz.name}
              </p>
              <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#555" }}>
                {platz.beschreibung}
              </p>
              {platz.maxLaenge && (
                <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>
                  Max. {platz.maxLaenge}m · Max. {platz.maxHoehe}m Höhe
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Karte;