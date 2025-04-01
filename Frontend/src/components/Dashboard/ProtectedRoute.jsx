import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const authToken = sessionStorage.getItem("authToken");

  return authToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;





// import React, { useEffect } from "react";
// import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

// const ProtectedRoute = () => {
//   const authToken = sessionStorage.getItem("authToken");
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleNavigation = (event) => {
//       const publicRoutes = ["/", "/login", "/signup", "/contact", "/services", "/about"];
//       const isLeavingProtectedRoute = publicRoutes.includes(location.pathname);

//       if (authToken && isLeavingProtectedRoute) {
//         const confirmLeave = window.confirm("Are you sure you want to logout?");
//         if (confirmLeave) {
//           sessionStorage.removeItem("authToken");
//           navigate("/login", { replace: true });
//         } else {
//           event.preventDefault();
//           window.history.pushState(null, "", location.pathname); // Block navigation
//         }
//       }
//     };

//     window.addEventListener("popstate", handleNavigation);

//     return () => {
//       window.removeEventListener("popstate", handleNavigation);
//     };
//   }, [authToken, location.pathname, navigate]);

//   return authToken ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;
