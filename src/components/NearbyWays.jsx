import { useEffect, useState } from "react";
import fetchNearestNode from "../../api/fetchNearestNode";
import fetchRelationsByNode from "../../api/fetchRelationsByNode";

function NearbyRoutes() {
  const [relationIds, setRelationIds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const lat = 12.1271681; // Metrocentro latitude
    const lon = -86.265655; // Metrocentro longitude

    fetchNearestNode(lat, lon)
      .then((node) => {
        if (node) {
          console.log("Nearest bus stop found:", node);
          fetchRelationsByNode(node.id).then((relations) => {
            if (relations.length > 0) {
              setRelationIds(relations);
            } else {
              setError("No se encontraron rutas de autobús cercanas.");
            }
          });
        } else {
          setError("No se encontró una parada de autobús cercana.");
        }
      })
      .catch((err) => {
        setError("Error al obtener datos.");
        console.error("Fetch Error:", err);
      });
  }, []);

  return (
    <div className="mt-6 p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Rutas de Bus Cercanas</h2>
      {error && <p className="text-red-500">{error}</p>}

      {relationIds.length > 0 ? (
        <>
          <p className="p-2 border-b">
            Haz clic en una ruta para verla en OpenStreetMap:
          </p>
          <ul>
            {relationIds.map((relId) => (
              <li key={relId} className="mb-2">
                <a
                  href={`https://www.openstreetmap.org/relation/${relId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Ver Ruta {relId} en OpenStreetMap
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default NearbyRoutes;
