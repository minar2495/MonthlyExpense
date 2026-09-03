import { useEffect, useState } from "react";

import {
    ArrowDownRight,
    Check,
    Loader2,
    Receipt,
    Send,
    Unlink,
    Users,
    X
} from "lucide-react";

import api from "../services/api";
import MonthSelector from "../components/MonthSelector";
import { useAuth } from "../context/AuthContext";


const categories = [
    "Needs",
    "Wants",
    "Savings"
];


function JointExpenses() {
    const now = new Date();
    const { user } = useAuth();

    const [year, setYear] =
        useState(now.getFullYear());

    const [month, setMonth] =
        useState(now.getMonth() + 1);

    const [expenses, setExpenses] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [requests, setRequests] =
        useState([]);

    const [approved, setApproved] =
        useState(false);

    const [partnerEmail, setPartnerEmail] =
        useState("");

    const [sharingLoading, setSharingLoading] =
        useState(true);

    const [sharingSaving, setSharingSaving] =
        useState(false);

    const approvedRequest = requests.find(
        (request) => request.status === "approved"
    );

    useEffect(() => {
        const loadSharing = async () => {
            try {
                setSharingLoading(true);
                setError("");

                const response = await api.get(
                    "/sharing/requests"
                );

                setRequests(response.data.requests);
                setApproved(response.data.approved);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                    "Unable to load sharing details."
                );
            } finally {
                setSharingLoading(false);
            }
        };

        loadSharing();
    }, []);

    useEffect(() => {
        const loadExpenses = async () => {
            if (!approved) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const response = await api.get(
                    "/sharing/expenses"
                );

                setExpenses(response.data);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                    "Unable to load joint expenses."
                );
            } finally {
                setLoading(false);
            }
        };

        loadExpenses();
    }, [approved]);

    const sendRequest = async (event) => {
        event.preventDefault();

        try {
            setSharingSaving(true);
            setError("");

            const response = await api.post(
                "/sharing/requests",
                { email: partnerEmail }
            );

            setRequests((current) => [
                response.data.request,
                ...current
            ]);
            setPartnerEmail("");
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to send sharing request."
            );
        } finally {
            setSharingSaving(false);
        }
    };

    const updateRequest = async (requestId, status) => {
        try {
            setSharingSaving(true);
            setError("");

            await api.patch(
                `/sharing/requests/${requestId}`,
                { status }
            );

            setRequests((current) => current.map((request) =>
                request.id === requestId
                    ? { ...request, status }
                    : request
            ));

            if (status === "approved") {
                setApproved(true);
            }
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to update sharing request."
            );
        } finally {
            setSharingSaving(false);
        }
    };

    const stopSharing = async () => {
        if (!approvedRequest) return;

        const confirmed = window.confirm(
            "Stop sharing expense details with this partner?"
        );

        if (!confirmed) return;

        try {
            setSharingSaving(true);
            setError("");

            await api.delete(
                `/sharing/requests/${approvedRequest.id}`
            );

            setRequests((current) => current.filter(
                (request) => request.id !== approvedRequest.id
            ));
            setApproved(false);
            setExpenses([]);
        } catch (requestError) {
            setError(
                requestError.response?.data?.message ||
                "Unable to stop sharing."
            );
        } finally {
            setSharingSaving(false);
        }
    };

    const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);

        return (
            expenseDate.getFullYear() === year &&
            expenseDate.getMonth() + 1 === month
        );
    });

    const totalExpenses = filteredExpenses.reduce(
        (total, expense) => total + Number(expense.amount),
        0
    );

    const categoryTotal = (category) =>
        filteredExpenses
            .filter((expense) => expense.category === category)
            .reduce((total, expense) => total + Number(expense.amount), 0);

    const formatMoney = (amount) =>
        `₹${Number(amount || 0).toLocaleString("en-IN", {
            maximumFractionDigits: 0
        })}`;

    if (sharingLoading || loading) {
        return (
            <div className="min-h-125 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={32} className="animate-spin mx-auto" />
                    <p className="text-gray-500 mt-3">
                        Loading joint expenses...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-6">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                            <Users size={22} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">
                                Joint Expenses
                            </h1>
                            <p className="text-gray-500 mt-1">
                                One shared view of your household spending.
                            </p>
                        </div>
                    </div>
                </div>

                <MonthSelector
                    month={month}
                    year={year}
                    onChange={(nextMonth, nextYear) => {
                        setMonth(nextMonth);
                        setYear(nextYear);
                    }}
                />
            </div>

            {approved && approvedRequest && (
                <div className="bg-white border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="font-semibold">
                            Sharing with {String(approvedRequest.requester?.id) === String(user?.id)
                                ? approvedRequest.recipient.name
                                : approvedRequest.requester.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Both accounts can view the shared expense details.
                        </p>
                    </div>
                    <button
                        onClick={stopSharing}
                        disabled={sharingSaving}
                        className="border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-50 disabled:opacity-50"
                    >
                        <Unlink size={18} />
                        Stop sharing
                    </button>
                </div>
            )}

            {!approved && (
                <div className="bg-white border rounded-2xl p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-bold">
                            Request access to shared expenses
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Send a request first. Expense details appear only after the other person approves it.
                        </p>
                    </div>

                    <form
                        onSubmit={sendRequest}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <input
                            type="email"
                            value={partnerEmail}
                            onChange={(event) =>
                                setPartnerEmail(event.target.value)
                            }
                            placeholder="Partner's account email"
                            className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                        <button
                            type="submit"
                            disabled={sharingSaving}
                            className="bg-black text-white px-5 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {sharingSaving ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} />
                            )}
                            Send request
                        </button>
                    </form>

                    {requests.length > 0 && (
                        <div className="space-y-3">
                            {requests.map((request) => {
                                const incoming =
                                    String(request.recipient?.id) ===
                                    String(user?.id);

                                return (
                                    <div
                                        key={request.id}
                                        className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                {incoming
                                                    ? `Request from ${request.requester.name}`
                                                    : `Request to ${request.recipient.name}`}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {incoming
                                                    ? request.requester.email
                                                    : request.recipient.email}
                                                {" · "}
                                                {request.status}
                                            </p>
                                        </div>

                                        {incoming && request.status === "pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => updateRequest(request.id, "approved")}
                                                    disabled={sharingSaving}
                                                    className="bg-black text-white px-3 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    <Check size={16} />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => updateRequest(request.id, "rejected")}
                                                    disabled={sharingSaving}
                                                    className="border px-3 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    <X size={16} />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {approved && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-black text-white rounded-2xl p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <Receipt size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">
                                Joint total
                            </p>
                            <p className="text-2xl font-bold">
                                {formatMoney(totalExpenses)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-2xl p-5">
                    <p className="text-sm text-gray-500">Transactions</p>
                    <p className="text-2xl font-bold mt-2">
                        {filteredExpenses.length}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        This month
                    </p>
                </div>

                {categories.map((category) => (
                    <div
                        key={category}
                        className="bg-white border rounded-2xl p-5"
                    >
                        <p className="text-sm text-gray-500">{category}</p>
                        <p className="text-2xl font-bold mt-2">
                            {formatMoney(categoryTotal(category))}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Shared spending
                        </p>
                    </div>
                ))}
            </div>}

            {approved && <div className="bg-white border rounded-2xl overflow-hidden">
                <div className="p-5 border-b flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold">
                            Shared spending details
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {filteredExpenses.length} expense{filteredExpenses.length === 1 ? "" : "s"} in the selected month
                        </p>
                    </div>
                    <ArrowDownRight className="text-gray-400" size={20} />
                </div>

                {filteredExpenses.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No shared expenses for this month.
                    </div>
                ) : (
                    <div className="divide-y">
                        {filteredExpenses.map((expense) => (
                            <div
                                key={expense._id}
                                className="p-5 flex items-center justify-between gap-4"
                            >
                                <div className="min-w-0">
                                    <p className="font-semibold truncate">
                                        {expense.title}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {expense.category} · {new Date(expense.date).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </p>
                                </div>
                                <p className="font-bold whitespace-nowrap">
                                    {formatMoney(expense.amount)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>}
        </div>
    );
}

export default JointExpenses;
