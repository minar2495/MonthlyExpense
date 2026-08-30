import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
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
                "/auth/register",
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
                "Registration failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">

                <h1 className="text-3xl font-bold text-center">
                    Create Account
                </h1>

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
                        name="name"
                        placeholder="Full name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                        required
                    />

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
                        Create Account
                    </button>

                </form>

                <p className="text-center mt-5">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Register;