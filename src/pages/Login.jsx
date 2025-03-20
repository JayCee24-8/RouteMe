import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/Store";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const setUsername = useUserStore((state) => state.setUsername);

  const onSubmit = (data) => {
    setUsername(data.email); // Store email as username in Zustand store
    navigate("/home"); // Redirect to home page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Bienvenido de vuelta!</h1>

        <img
          src="/logo.png"
          alt="RouteMe Logo"
          className="mx-auto w-32 h-32 mb-4"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <input
            type="email"
            placeholder="Ingresa tu email"
            {...register("email", { required: "El email es requerido" })}
            className="w-full p-3 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            {...register("password", {
              required: "La contraseña es requerida",
            })}
            className="w-full p-3 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <div className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-teal-500 hover:underline text-sm"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 rounded-md hover:bg-teal-600"
          >
            Inicia Sesión
          </button>
        </form>

        <p className="mt-4 text-gray-600 text-sm">
          ¿Aún no tienes una cuenta?{" "}
          <Link
            to="/register"
            className="text-teal-500 font-semibold hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
