import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useState } from "react";

const AdminLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">

            <Sidebar 
                isMobileMenuOpen={isMobileMenuOpen} 
                setIsMobileMenuOpen={setIsMobileMenuOpen} 
            />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

                <Topbar setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>
            </main>

        </div>
    );
}

export default AdminLayout