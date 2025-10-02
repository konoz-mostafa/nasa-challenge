
import React, { useEffect, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

function ViewMarkers({ token, mapId }) {
  const [markers, setMarkers] = useState([]);

  const privacyColors = {
    everyone: "blue",
    onlyme: "green",
    none: "red",
  };

  useEffect(() => {
    async function loadMarkers() {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/markers?mapId=${mapId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch markers");
        const data = await res.json();
        setMarkers(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadMarkers();
  }, [token, mapId]);

  return (
    <>
      {markers.map((m) => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={L.divIcon({
            className: "custom-marker",
            html: `<div style="background:${privacyColors[m.privacy]};width:20px;height:20px;border-radius:50%"></div>`,
          })}
        >
          <Popup>
            Marker ID: {m.id} - Privacy: {m.privacy}
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default ViewMarkers;

