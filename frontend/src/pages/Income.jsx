import { useEffect, useState } from "react";

import {
    Plus,
    Pencil,
    Trash2,
    Wallet,
    X,
    Loader2
} from "lucide-react";

import api from "../services/api";

function Income() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    const [income, setIncome] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingIncome, setEditingIncome] =
        useState(null);

    const [form, setForm] = useState({
        source: "",
        amount: "",
        date: today
    });


    const loadIncome = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/income");

            setIncome(response.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load income."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadIncome();
    }, []);


    const openAddModal = () => {

        setEditingIncome(null);

        setForm({
            source: "",
            amount: "",
            date: today
        });

        setError("");
        setShowModal(true);
    };


    const openEditModal = (item) => {

        setEditingIncome(item);

        setForm({
            source: item.source,
            amount: item.amount,
            date: new Date(item.date)
                .toISOString()
                .split("T")[0]
        });

        setError("");
        setShowModal(true);
    };


    const closeModal = () => {

        if (saving) return;

        setShowModal(false);
        setEditingIncome(null);
    };


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]:
                e.target.value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (
            !form.source.trim() ||
            !form.amount ||
            !form.date
        ) {

            setError(
                "Please fill in all fields."
            );

            return;
        }


        if (Number(form.amount) <= 0) {

            setError(
                "Amount must be greater than zero."
            );

            return;
        }


        try {

            setSaving(true);

            if (editingIncome) {

                await api.put(
                    `/income/${editingIncome._id}`,
                    {
                        source:
                            form.source.trim(),

                        amount:
                            Number(form.amount),

                        date: form.date
                    }
                );

            } else {

                await api.post(
                    "/income",
                    {
                        source:
                            form.source.trim(),

                        amount:
                            Number(form.amount),

                        date: form.date
                    }
                );
            }


            await loadIncome();

            closeModal();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to save income."
            );

        } finally {

            setSaving(false);

        }
    };


    const deleteIncome = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this income?"
            );

        if (!confirmed) return;


        try {

            await api.delete(
                `/income/${id}`
            );

            setIncome(
                income.filter(
                    item =>
                        item._id !== id
                )
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to delete income."
            );
        }
    };


    const totalIncome =
        income.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );


    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>

                    <h1 className="text-3xl font-bold">
                        Income
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your monthly income.
                    </p>

                </div>


                <button
                    onClick={openAddModal}
                    className="bg-black text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={19} />

                    Add Income
                </button>

            </div>


            {/* Total */}

            <div className="bg-black text-white rounded-2xl p-6">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">

                        <Wallet size={22} />

                    </div>

                    <div>

                        <p className="text-sm text-gray-400">
                            Total Income
                        </p>

                        <h2 className="text-3xl font-bold">
                            ₹
                            {totalIncome.toLocaleString(
                                "en-IN"
                            )}
                        </h2>

                    </div>

                </div>

            </div>


            {/* Error */}

            {error && !showModal && (

                <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
                    {error}
                </div>

            )}


            {/* Income table */}

            <div className="bg-white border rounded-2xl overflow-hidden">

                <div className="px-5 py-4 border-b">

                    <h2 className="font-bold">
                        Income History
                    </h2>

                </div>


                {loading ? (

                    <div className="p-10 flex justify-center">

                        <Loader2
                            className="animate-spin"
                            size={25}
                        />

                    </div>

                ) : income.length === 0 ? (

                    <div className="p-12 text-center">

                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto">

                            <Wallet
                                size={25}
                                className="text-gray-500"
                            />

                        </div>

                        <h3 className="font-semibold mt-4">
                            No income recorded
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Add your first income source.
                        </p>

                        <button
                            onClick={openAddModal}
                            className="mt-5 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
                        >
                            Add Income
                        </button>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="text-left text-sm text-gray-500 border-b">

                                    <th className="px-5 py-4">
                                        Source
                                    </th>

                                    <th className="px-5 py-4">
                                        Date
                                    </th>

                                    <th className="px-5 py-4 text-right">
                                        Amount
                                    </th>

                                    <th className="px-5 py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {income.map(
                                    (item) => (

                                        <tr
                                            key={item._id}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4">

                                                <div className="font-medium">
                                                    {item.source}
                                                </div>

                                            </td>


                                            <td className="px-5 py-4 text-gray-500 text-sm">

                                                {new Date(
                                                    item.date
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )}

                                            </td>


                                            <td className="px-5 py-4 text-right font-semibold">

                                                ₹
                                                {Number(
                                                    item.amount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </td>


                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        onClick={() =>
                                                            openEditModal(
                                                                item
                                                            )
                                                        }
                                                        className="p-2 rounded-lg hover:bg-gray-100"
                                                        title="Edit"
                                                    >

                                                        <Pencil
                                                            size={17}
                                                        />

                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            deleteIncome(
                                                                item._id
                                                            )
                                                        }
                                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                                                        title="Delete"
                                                    >

                                                        <Trash2
                                                            size={17}
                                                        />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* Modal */}

            {showModal && (

                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">

                        <div className="flex items-center justify-between px-6 py-5 border-b">

                            <div>

                                <h2 className="text-xl font-bold">
                                    {editingIncome
                                        ? "Edit Income"
                                        : "Add Income"}
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {editingIncome
                                        ? "Update your income details."
                                        : "Record a new income source."}
                                </p>

                            </div>


                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >

                                <X size={20} />

                            </button>

                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="p-6 space-y-5"
                        >

                            {error && (

                                <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
                                    {error}
                                </div>

                            )}


                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Income source
                                </label>

                                <input
                                    type="text"
                                    name="source"
                                    value={form.source}
                                    onChange={handleChange}
                                    placeholder="e.g. Salary"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Amount
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        name="amount"
                                        value={form.amount}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="w-full border rounded-xl pl-9 pr-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                                    />

                                </div>

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Date
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                                />

                            </div>


                            <div className="flex gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="flex-1 border rounded-xl py-3 font-semibold hover:bg-gray-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-black text-white rounded-xl py-3 font-semibold hover:bg-gray-800 disabled:opacity-60 flex items-center justify-center gap-2"
                                >

                                    {saving ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />

                                            Saving...
                                        </>
                                    ) : (
                                        editingIncome
                                            ? "Update Income"
                                            : "Add Income"
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Income;