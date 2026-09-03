import { useEffect, useState } from "react";

import {
    Plus,
    Pencil,
    Trash2,
    Receipt,
    X,
    Loader2,
    Download,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import api from "../services/api";
import MonthSelector from "../components/MonthSelector";


const categories = [
    {
        name: "Needs",
        description: "Essential expenses",
        target: 50
    },
    {
        name: "Wants",
        description: "Lifestyle & entertainment",
        target: 30
    },
    {
        name: "Savings",
        description: "Savings & investments",
        target: 20
    }
];


function Expenses() {

    const now = new Date();

    const [year, setYear] =
        useState(now.getFullYear());

    const [month, setMonth] =
        useState(now.getMonth() + 1);

    const [currentPage, setCurrentPage] =
        useState(1);

    const [downloading, setDownloading] =
        useState(false);

    const itemsPerPage = 10;

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const [expenses, setExpenses] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingExpense, setEditingExpense] =
        useState(null);


    const [form, setForm] = useState({
        title: "",
        amount: "",
        category: "Needs",
        date: today
    });


    const loadExpenses = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/expenses");

            setExpenses(response.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load expenses."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadExpenses();

    }, []);


    const openAddModal = () => {

        setEditingExpense(null);

        setForm({
            title: "",
            amount: "",
            category: "Needs",
            date: today
        });

        setError("");
        setShowModal(true);
    };


    const openEditModal = (expense) => {

        setEditingExpense(expense);

        setForm({
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date:
                new Date(expense.date)
                    .toISOString()
                    .split("T")[0]
        });

        setError("");
        setShowModal(true);
    };


    const closeModal = () => {

        if (saving) return;

        setShowModal(false);
        setEditingExpense(null);
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
            !form.title.trim() ||
            !form.amount ||
            !form.category ||
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


            const data = {
                title: form.title.trim(),
                amount: Number(form.amount),
                category: form.category,
                date: form.date
            };


            if (editingExpense) {

                await api.put(
                    `/expenses/${editingExpense._id}`,
                    data
                );

            } else {

                await api.post(
                    "/expenses",
                    data
                );

            }


            await loadExpenses();

            closeModal();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to save expense."
            );

        } finally {

            setSaving(false);

        }
    };


    const deleteExpense = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this expense?"
            );


        if (!confirmed) return;


        try {

            await api.delete(
                `/expenses/${id}`
            );


            setExpenses(
                expenses.filter(
                    item =>
                        item._id !== id
                )
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to delete expense."
            );

        }
    };


    const downloadAllExpensesExcel = async () => {

        try {

            setDownloading(true);

            const response = await api.get(
                "/reports/excel/all",
                {
                    responseType: "blob"
                }
            );

            const url = window.URL.createObjectURL(
                new Blob(
                    [response.data],
                    {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    }
                )
            );

            const link = document.createElement("a");

            link.href = url;
            link.download = "SmartBudget-All-Expenses.xlsx";

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error("Download failed:", error);
            setError("Unable to download all expenses.");

        } finally {

            setDownloading(false);

        }
    };


    const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);

        return (
            expenseDate.getFullYear() === year &&
            expenseDate.getMonth() + 1 === month
        );
    });

    const totalPages = Math.max(
        1,
        Math.ceil(filteredExpenses.length / itemsPerPage)
    );

    const page = Math.min(currentPage, totalPages);

    const visibleExpenses = filteredExpenses.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );


    const totalExpenses =
        filteredExpenses.reduce(
            (total, item) =>
                total + Number(item.amount),
            0
        );


    const getCategoryTotal =
        (category) => {

            return filteredExpenses
                .filter(
                    item =>
                        item.category === category
                )
                .reduce(
                    (total, item) =>
                        total +
                        Number(item.amount),
                    0
                );
        };


    return (

        <div className="space-y-6">

            {/* Header */}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                <div>

                    <h1 className="text-3xl font-bold">
                        Expenses
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Track and manage your expenses.
                    </p>

                </div>


                <div className="flex flex-col sm:flex-row gap-3">

                    <MonthSelector
                        month={month}
                        year={year}
                        onChange={(nextMonth, nextYear) => {
                            setMonth(nextMonth);
                            setYear(nextYear);
                            setCurrentPage(1);
                        }}
                    />

                    <button
                        onClick={downloadAllExpensesExcel}
                        disabled={downloading}
                        className="px-4 py-2.5 border bg-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50"
                    >

                        {downloading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Download size={18} />
                        )}

                        {downloading ? "Downloading..." : "Download All Excel"}

                    </button>

                    <button
                        onClick={openAddModal}
                        className="bg-black text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800"
                    >

                        <Plus size={19} />

                        Add Expense

                    </button>

                </div>

            </div>


            {/* Summary */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


                <div className="bg-black text-white rounded-2xl p-5">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">

                            <Receipt size={20} />

                        </div>

                        <div>

                            <p className="text-sm text-gray-400">
                                Total Expenses
                            </p>

                            <p className="text-2xl font-bold">
                                ₹
                                {totalExpenses.toLocaleString(
                                    "en-IN"
                                )}
                            </p>

                        </div>

                    </div>

                </div>


                {categories.map(
                    (category) => (

                        <div
                            key={category.name}
                            className="bg-white border rounded-2xl p-5"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="font-semibold">
                                        {category.name}
                                    </p>

                                    <p className="text-xs text-gray-500 mt-1">
                                        {category.target}% target
                                    </p>

                                </div>

                                <p className="font-bold">

                                    ₹
                                    {getCategoryTotal(
                                        category.name
                                    ).toLocaleString(
                                        "en-IN"
                                    )}

                                </p>

                            </div>

                        </div>

                    )
                )}

            </div>


            {/* Error */}

            {error && !showModal && (

                <div className="bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
                    {error}
                </div>

            )}


            {/* Expense list */}

            <div className="bg-white border rounded-2xl overflow-hidden">

                <div className="px-5 py-4 border-b">

                    <h2 className="font-bold">
                        Expense History
                    </h2>

                </div>


                {loading ? (

                    <div className="p-10 flex justify-center">

                        <Loader2
                            size={25}
                            className="animate-spin"
                        />

                    </div>

                ) : filteredExpenses.length === 0 ? (

                    <div className="p-12 text-center">

                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto">

                            <Receipt
                                size={25}
                                className="text-gray-500"
                            />

                        </div>

                        <h3 className="font-semibold mt-4">
                            No expenses for this month
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Start tracking your expenses.
                        </p>

                        <button
                            onClick={openAddModal}
                            className="mt-5 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
                        >
                            Add Expense
                        </button>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="text-left text-sm text-gray-500 border-b">

                                    <th className="px-5 py-4">
                                        Expense
                                    </th>

                                    <th className="px-5 py-4">
                                        Category
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

                                {visibleExpenses.map(
                                    (expense) => (

                                        <tr
                                            key={expense._id}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4">

                                                <p className="font-medium">
                                                    {expense.title}
                                                </p>

                                            </td>


                                            <td className="px-5 py-4">

                                                <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold">

                                                    {expense.category}

                                                </span>

                                            </td>


                                            <td className="px-5 py-4 text-sm text-gray-500">

                                                {new Date(
                                                    expense.date
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
                                                    expense.amount
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </td>


                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        onClick={() =>
                                                            openEditModal(
                                                                expense
                                                            )
                                                        }
                                                        className="p-2 rounded-lg hover:bg-gray-100"
                                                    >

                                                        <Pencil
                                                            size={17}
                                                        />

                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            deleteExpense(
                                                                expense._id
                                                            )
                                                        }
                                                        className="p-2 rounded-lg text-red-500 hover:bg-red-50"
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

                        {filteredExpenses.length > itemsPerPage && (
                            <div className="flex items-center justify-between px-5 py-4 border-t">

                                <p className="text-sm text-gray-500">
                                    Page {page} of {totalPages}
                                </p>

                                <div className="flex gap-2">

                                    <button
                                        onClick={() => setCurrentPage(page - 1)}
                                        disabled={page === 1}
                                        className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-40"
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(page + 1)}
                                        disabled={page === totalPages}
                                        className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-40"
                                        aria-label="Next page"
                                    >
                                        <ChevronRight size={18} />
                                    </button>

                                </div>

                            </div>
                        )}

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

                                    {editingExpense
                                        ? "Edit Expense"
                                        : "Add Expense"}

                                </h2>

                                <p className="text-sm text-gray-500 mt-1">

                                    {editingExpense
                                        ? "Update your expense."
                                        : "Record a new expense."}

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
                                    Expense name
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Groceries"
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
                                    Budget category
                                </label>

                                <div className="grid grid-cols-3 gap-2">

                                    {categories.map(
                                        (category) => (

                                            <button
                                                type="button"
                                                key={
                                                    category.name
                                                }
                                                onClick={() =>
                                                    setForm({
                                                        ...form,
                                                        category:
                                                            category.name
                                                    })
                                                }
                                                className={`rounded-xl border p-3 text-left transition ${
                                                    form.category ===
                                                    category.name
                                                        ? "border-black bg-black text-white"
                                                        : "hover:bg-gray-50"
                                                }`}
                                            >

                                                <p className="text-sm font-semibold">
                                                    {
                                                        category.name
                                                    }
                                                </p>

                                                <p
                                                    className={`text-xs mt-1 ${
                                                        form.category ===
                                                        category.name
                                                            ? "text-gray-300"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {
                                                        category.target
                                                    }
                                                    %
                                                </p>

                                            </button>

                                        )
                                    )}

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

                                        editingExpense
                                            ? "Update Expense"
                                            : "Add Expense"

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

export default Expenses;