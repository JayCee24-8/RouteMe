import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm w-full">
        <img
          src="/logo.png"
          alt="RouteMe Logo"
          className="mx-auto w-32 h-32 mb-4"
        />
        <h1 className="text-xl font-bold mb-2">
          Encuentra tu ruta perfecta con RouteMe
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-teal-500 text-white py-2 rounded-md mb-3 hover:bg-teal-600"
        >
          Identifícate
        </button>
        <button
          onClick={() => navigate("/guest")}
          className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
        >
          Ingresar como invitado
        </button>
      </div>
    </div>
  );
}

export default Splash;
