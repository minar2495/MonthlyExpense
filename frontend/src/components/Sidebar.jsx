import {
    LayoutDashboard,
    Wallet,
    Receipt,
    Users,
    BarChart3,
    LogOut,
    X
} from "lucide-react";

import {
    NavLink
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar({
    open,
    setOpen
}) {
    const { user, logout } = useAuth();

    const displayName =
        user?.name || user?.email || "User";

    const initial =
        displayName.charAt(0).toUpperCase();

    const links = [
        {
            to: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            to: "/income",
            label: "Income",
            icon: Wallet
        },
        {
            to: "/expenses",
            label: "Expenses",
            icon: Receipt
        },
        {
            to: "/joint-expenses",
            label: "Joint Expenses",
            icon: Users
        },
        {
            to: "/reports",
            label: "Reports",
            icon: BarChart3
        }
    ];

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 z-30 md:hidden"
                    onClick={() =>
                        setOpen(false)
                    }
                />
            )}

            <aside
                className={`
                    fixed z-40 inset-y-0 left-0
                    w-64 bg-white/90 backdrop-blur border-r
                    transform transition-transform
                    md:translate-x-0
                    ${open
                        ? "translate-x-0"
                        : "-translate-x-full"}
                `}
            >

                <div className="h-16 px-6 flex items-center justify-between border-b">

                    <div>
                        <h1 className="text-xl font-bold tracking-tight">
                            SmartBudget
                        </h1>

                        <p className="text-xs text-gray-500 uppercase tracking-[0.16em]">
                            Your money, clearer
                        </p>
                    </div>

                    <button
                        className="md:hidden"
                        onClick={() =>
                            setOpen(false)
                        }
                    >
                        <X size={20} />
                    </button>

                </div>

                <nav className="p-4 space-y-2">

                    {links.map((link) => {

                        const Icon =
                            link.icon;

                        return (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() =>
                                    setOpen(false)
                                }
                                className={({ isActive }) =>
                                    `
                                    flex items-center gap-3
                                    px-4 py-3 rounded-xl font-medium
                                    transition
                                    ${isActive
                                        ? "bg-black text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-100"}
                                    `
                                }
                            >
                                <Icon size={20} />
                                {link.label}
                            </NavLink>
                        );
                    })}

                </nav>

                <div className="absolute bottom-5 left-4 right-4">

                    <div className="mb-3 flex items-center gap-3 rounded-xl border bg-white/70 px-3 py-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#c8f169] text-lg font-bold text-[#17211b]">
                            {initial}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate font-semibold">
                                {displayName}
                            </p>

                            {user?.name && user?.email && (
                                <p className="truncate text-xs text-gray-500">
                                    {user.email}
                                </p>
                            )}
                        </div>

                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;