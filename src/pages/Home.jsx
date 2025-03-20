import { useUserStore } from "../../store/Store";
import { useState } from "react";
import NearbyWays from "../components/NearbyWays";

function Home() {
  const username = useUserStore((state) => state.username);
  const [destination, setDestination] = useState("");
  const [showRoutes, setShowRoutes] = useState(false);
  const supportedLocation = "Metrocentro";
  const [error, setError] = useState("");

  const handleSearch = () => {
    console.log("User searched for:", destination);

    if (destination.toLowerCase() === supportedLocation.toLowerCase()) {
      console.log("Valid destination! Showing routes.");
      setError("");
      setShowRoutes(true);
    } else {
      console.log("Invalid destination. Showing error.");
      setError("Localización no soportada");
      setShowRoutes(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md">
        <div className="bg-teal-500 p-6 rounded-t-lg text-white flex justify-between items-center">
          <h1 className="text-lg font-bold">
            Bienvenid@, {username || "Usuario"}
          </h1>
          <img
            src="/profile.png"
            alt="User Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>

        <div className="bg-white p-6 rounded-b-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Encuentra tu ruta ideal!</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Destino (Ej: Metrocentro)"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleSearch}
            className="w-full bg-teal-500 text-white py-3 rounded-md hover:bg-teal-600"
          >
            Buscar Ruta
          </button>
        </div>
      </div>

      {showRoutes && <NearbyWays />}
    </div>
  );
}

export default Home;
