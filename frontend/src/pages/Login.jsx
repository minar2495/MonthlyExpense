import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!form.email || !form.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            await login(
                form.email,
                form.password
            );

            navigate("/dashboard", {
                replace: true
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* Left branding */}

            <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-12 items-center">

                <div className="max-w-lg mx-auto">

                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-11 h-11 rounded-xl bg-white text-black flex items-center justify-center">
                            <Wallet size={23} />
                        </div>

                        <span className="text-2xl font-bold">
                            SmartBudget
                        </span>
                    </div>

                    <h1 className="text-5xl font-bold leading-tight">
                        Take control of your money.
                    </h1>

                    <p className="mt-6 text-gray-400 text-lg leading-relaxed">
                        Manage your monthly income and expenses
                        with the simple 50 / 30 / 20 budgeting rule.
                    </p>

                    <div className="grid grid-cols-3 gap-4 mt-12">

                        <div>
                            <p className="text-3xl font-bold">
                                50%
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                Needs
                            </p>
                        </div>

                        <div>
                            <p className="text-3xl font-bold">
                                30%
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                Wants
                            </p>
                        </div>

                        <div>
                            <p className="text-3xl font-bold">
                                20%
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                Savings
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            {/* Login */}

            <div className="flex-1 flex items-center justify-center p-6">

                <div className="w-full max-w-md">

                    {/* Mobile logo */}

                    <div className="lg:hidden flex items-center justify-center gap-2 mb-10">

                        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                            <Wallet size={21} />
                        </div>

                        <span className="text-xl font-bold">
                            SmartBudget
                        </span>

                    </div>

                    <div className="bg-white border rounded-3xl p-7 sm:p-9 shadow-sm">

                        <div className="mb-8">

                            <h2 className="text-3xl font-bold">
                                Welcome back
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Sign in to manage your finances.
                            </p>

                        </div>

                        {error && (
                            <div className="mb-5 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Email address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                                />

                            </div>

                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full border rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white rounded-xl py-3.5 font-semibold hover:bg-gray-800 disabled:opacity-60 flex items-center justify-center gap-2"
                            >

                                {loading ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}

                            </button>

                        </form>

                        <p className="text-center text-sm text-gray-500 mt-7">

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="font-semibold text-black hover:underline"
                            >
                                Create account
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;