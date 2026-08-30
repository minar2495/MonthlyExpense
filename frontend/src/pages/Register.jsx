import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    Wallet,
    Eye,
    EyeOff,
    Loader2
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !form.name ||
            !form.email ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError(
                "Please fill in all fields."
            );

            return;
        }

        if (form.password.length < 6) {
            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }

        if (
            form.password !==
            form.confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );

            return;
        }

        try {
            setLoading(true);

            await register(
                form.name,
                form.email,
                form.password
            );

            navigate("/dashboard", {
                replace: true
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create account."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* Branding */}

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
                        Build better money habits.
                    </h1>

                    <p className="mt-6 text-gray-400 text-lg leading-relaxed">
                        Create your free account and start
                        tracking where your money goes every month.
                    </p>

                    <div className="mt-12 space-y-5">

                        <div className="flex gap-4">

                            <div className="font-bold text-xl">
                                01
                            </div>

                            <div>
                                <p className="font-semibold">
                                    Track income
                                </p>

                                <p className="text-gray-400 text-sm mt-1">
                                    Keep all your monthly income in one place.
                                </p>
                            </div>

                        </div>

                        <div className="flex gap-4">

                            <div className="font-bold text-xl">
                                02
                            </div>

                            <div>
                                <p className="font-semibold">
                                    Control expenses
                                </p>

                                <p className="text-gray-400 text-sm mt-1">
                                    Know exactly where your money is going.
                                </p>
                            </div>

                        </div>

                        <div className="flex gap-4">

                            <div className="font-bold text-xl">
                                03
                            </div>

                            <div>
                                <p className="font-semibold">
                                    Reach your savings goal
                                </p>

                                <p className="text-gray-400 text-sm mt-1">
                                    Aim for the 20% savings target every month.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Register */}

            <div className="flex-1 flex items-center justify-center p-6">

                <div className="w-full max-w-md">

                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">

                        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                            <Wallet size={21} />
                        </div>

                        <span className="text-xl font-bold">
                            SmartBudget
                        </span>

                    </div>

                    <div className="bg-white border rounded-3xl p-7 sm:p-9 shadow-sm">

                        <div className="mb-7">

                            <h2 className="text-3xl font-bold">
                                Create account
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Start managing your money today.
                            </p>

                        </div>

                        {error && (
                            <div className="mb-5 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >

                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    autoComplete="name"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                                />

                            </div>

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
                                        placeholder="Minimum 6 characters"
                                        autoComplete="new-password"
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

                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Confirm password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        value={
                                            form.confirmPassword
                                        }
                                        onChange={handleChange}
                                        placeholder="Repeat your password"
                                        autoComplete="new-password"
                                        className="w-full border rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                    >
                                        {showConfirmPassword ? (
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
                                className="w-full bg-black text-white rounded-xl py-3.5 font-semibold hover:bg-gray-800 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                            >

                                {loading ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
                                )}

                            </button>

                        </form>

                        <p className="text-center text-sm text-gray-500 mt-7">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-semibold text-black hover:underline"
                            >
                                Sign in
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;