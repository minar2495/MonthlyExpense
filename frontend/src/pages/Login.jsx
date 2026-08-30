import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post(
                "/auth/login",
                form
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">

                <h1 className="text-3xl font-bold text-center">
                    SmartBudget
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Manage your money with 50/30/20
                </p>

                {error && (
                    <p className="text-red-500 mt-4">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4"
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

                    <button
                        className="w-full bg-black text-white p-3 rounded-lg"
                    >
                        Login
                    </button>

                </form>

                <p className="text-center mt-5">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;