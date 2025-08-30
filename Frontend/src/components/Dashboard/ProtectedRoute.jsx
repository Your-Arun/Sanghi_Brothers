import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const ProtectedRoute = () => {
  const authToken = sessionStorage.getItem("authToken");
  const location = useLocation();
  const navigate = useNavigate();
  const lastProtectedPath = useRef(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetPath, setTargetPath] = useState(null);

  const publicRoutes = ["/", "/about", "/services", "/contacts"];

  useEffect(() => {
    if (authToken) {
      // ✅ If current path is protected, save it
      if (!publicRoutes.includes(location.pathname)) {
        lastProtectedPath.current = location.pathname;
      }
    }
  }, [location.pathname, authToken]);

  useEffect(() => {
    if (!authToken) return;

    // ✅ If user navigates to public route from protected
    if (publicRoutes.includes(location.pathname) && lastProtectedPath.current) {
      setTargetPath(location.pathname);
      setShowConfirm(true);
    }
  }, [location.pathname, authToken]);

  const handleConfirm = (confirm) => {
    setShowConfirm(false);
    if (confirm) {
      sessionStorage.removeItem("authToken");
      navigate("/"); // logout → go home
    } else {
      navigate(lastProtectedPath.current); // back to protected page
    }
  };

  if (!authToken) return <Navigate to="/" replace />;

  return (
    <>
      <Outlet />
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Logout Confirmation</h2>
            <p className="mb-6">Do you really want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => handleConfirm(true)}
              >
                Yes, Logout
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => handleConfirm(false)}
              >
                No, Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;

