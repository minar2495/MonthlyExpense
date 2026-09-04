import {
    Menu
} from "lucide-react";

import {
    Outlet
} from "react-router-dom";

import {
    useState
} from "react";

import Sidebar from "./Sidebar";

function Layout() {
    const [open, setOpen] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-50">

            <Sidebar
                open={open}
                setOpen={setOpen}
            />

            <main className="md:ml-64">

                <header className="h-16 bg-white/80 backdrop-blur border-b flex items-center px-4 md:px-8">

                    <button
                        className="md:hidden mr-4"
                        onClick={() =>
                            setOpen(true)
                        }
                    >
                        <Menu />
                    </button>

                    <div className="flex-1">
                        <span className="text-sm uppercase tracking-[0.18em] text-gray-500">
                            Personal Finance / Overview
                        </span>
                    </div>

                </header>

                <div className="p-4 md:p-8">
                    <Outlet />
                </div>

            </main>

        </div>
    );
}

export default Layout;