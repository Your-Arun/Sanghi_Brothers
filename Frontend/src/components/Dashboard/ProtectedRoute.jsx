








import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
  const authToken = sessionStorage.getItem("authToken");
  const location = useLocation();
  const navigate = useNavigate();
  const lastProtectedPath = useRef(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const publicRoutes = ["/", "/about", "/services", "/contacts"];

  useEffect(() => {
    if (authToken) {
      if (!publicRoutes.includes(location.pathname)) {
        // ✅ Save last protected route
        lastProtectedPath.current = location.pathname;
      } else if (lastProtectedPath.current) {
        // ✅ If user tries to go to public route → show logout popup
        setShowConfirm(true);
      }
    }
  }, [location.pathname, authToken]);

  const handleConfirm = (confirm) => {
    setShowConfirm(false);
    if (confirm) {
      sessionStorage.removeItem("authToken");
      toast.success("You have been logged out!");
      navigate("/"); // redirect home after logout
    } else {
      // ❌ Cancel → return to last protected page
      navigate(lastProtectedPath.current);
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







// import { Navigate, Outlet } from "react-router-dom";
// const ProtectedRoute = () => {
//   const authToken = sessionStorage.getItem("authToken");
//   return authToken ? <Outlet /> : <Navigate to="/" replace />;
// };
// export default ProtectedRoute;




