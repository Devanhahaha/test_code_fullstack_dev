import { Routes, Route, Navigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import AdminLayout from "../layouts/AdminLayout";

// features
import Login from "../pages/auth/login";
import Dashboard from "../pages/admin/Dashboard";

export default function AppRoutes() {
    const auth = useContext(AuthContext);
    const isAuthenticated = auth?.isAuthenticated ?? false;

    return (
        <Routes>
            <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="admin/dashboard" />} />

            <Route
                path="/admin" 
                element={isAuthenticated ? <AdminLayout /> : <Navigate to="/" />}
            >
                {/* 
                  Nanti halaman-halaman admin masuk ke sini.
                  Sementara di-comment sampai file Dashboard.jsx selesai kamu buat.
                */}
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    )
}