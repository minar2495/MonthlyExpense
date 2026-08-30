import { useEffect, useState } from "react";

import {
    Wallet,
    TrendingUp,
    TrendingDown,
    PiggyBank,
    ChevronLeft,
    ChevronRight,
    Loader2,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from "recharts";

import api from "../services/api";


const categories = [
    {
        name: "Needs",
        percentage: 50
    },
    {
        name: "Wants",
        percentage: 30
    },
    {
        name: "Savings",
        percentage: 20
    }
];


function Dashboard() {

    const currentDate = new Date();

    const [year, setYear] =
        useState(
            currentDate.getFullYear()
        );

    const [month, setMonth] =
        useState(
            currentDate.getMonth() + 1
        );

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/dashboard",
                    {
                        params: {
                            year,
                            month
                        }
                    }
                );

            setDashboard(
                response.data
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load dashboard."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadDashboard();

    }, [year, month]);


    const previousMonth = () => {

        if (month === 1) {

            setMonth(12);
            setYear(year - 1);

        } else {

            setMonth(month - 1);

        }
    };


    const nextMonth = () => {

        if (month === 12) {

            setMonth(1);
            setYear(year + 1);

        } else {

            setMonth(month + 1);

        }
    };


    const monthName =
        new Date(
            year,
            month - 1,
            1
        ).toLocaleString(
            "en-IN",
            {
                month: "long"
            }
        );


    const formatMoney = (value) => {

        return `₹${Number(
            value || 0
        ).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 0
            }
        )}`;
    };


    if (loading) {

        return (

            <div className="min-h-[500px] flex items-center justify-center">

                <div className="text-center">

                    <Loader2
                        size={32}
                        className="animate-spin mx-auto"
                    />

                    <p className="text-gray-500 mt-3">
                        Loading dashboard...
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


    if (!dashboard) {
        return null;
    }


    const income =
        dashboard.income.total;

    const expenses =
        dashboard.expenses.total;

    const remaining =
        dashboard.remaining;


    const categoryTotals =
        dashboard.expenses.categories;

    const budget =
        dashboard.budget;


    const spendingData = [
        {
            name: "Needs",
            value: categoryTotals.Needs
        },
        {
            name: "Wants",
            value: categoryTotals.Wants
        },
        {
            name: "Savings",
            value: categoryTotals.Savings
        }
    ];


    const budgetData = [
        {
            name: "Needs",
            Budget: budget.Needs,
            Actual: categoryTotals.Needs
        },
        {
            name: "Wants",
            Budget: budget.Wants,
            Actual: categoryTotals.Wants
        },
        {
            name: "Savings",
            Budget: budget.Savings,
            Actual: categoryTotals.Savings
        }
    ];


    return (

        <div className="space-y-6">


            {/* Header */}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                <div>

                    <p className="text-sm text-gray-500">
                        Personal Finance
                    </p>

                    <h1 className="text-3xl font-bold mt-1">
                        Dashboard
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Here's your financial overview.
                    </p>

                </div>


                {/* Month selector */}

                <div className="flex items-center bg-white border rounded-xl p-1 shadow-sm">

                    <button
                        onClick={previousMonth}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >

                        <ChevronLeft
                            size={19}
                        />

                    </button>


                    <div className="min-w-[145px] text-center">

                        <p className="font-semibold">
                            {monthName}
                        </p>

                        <p className="text-xs text-gray-500">
                            {year}
                        </p>

                    </div>


                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >

                        <ChevronRight
                            size={19}
                        />

                    </button>

                </div>

            </div>


            {/* Summary cards */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">


                <SummaryCard
                    title="Income"
                    value={formatMoney(income)}
                    description={`${dashboard.income.count} transaction(s)`}
                    icon={<TrendingUp size={21} />}
                />


                <SummaryCard
                    title="Expenses"
                    value={formatMoney(expenses)}
                    description={`${dashboard.expenses.count} transaction(s)`}
                    icon={<TrendingDown size={21} />}
                />


                <SummaryCard
                    title="Remaining"
                    value={formatMoney(remaining)}
                    description="Available balance"
                    icon={<Wallet size={21} />}
                />


                <SummaryCard
                    title="Savings Target"
                    value={formatMoney(
                        budget.Savings
                    )}
                    description="20% of income"
                    icon={<PiggyBank size={21} />}
                />

            </div>


            {/* Balance status */}

            <div
                className={`rounded-2xl p-5 border ${
                    remaining >= 0
                        ? "bg-white"
                        : "bg-red-50 border-red-100"
                }`}
            >

                <div className="flex items-center justify-between gap-4">

                    <div>

                        <p className="text-sm text-gray-500">
                            Monthly Balance
                        </p>

                        <p
                            className={`text-2xl font-bold mt-1 ${
                                remaining < 0
                                    ? "text-red-600"
                                    : ""
                            }`}
                        >
                            {formatMoney(
                                remaining
                            )}
                        </p>

                    </div>


                    <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                            remaining >= 0
                                ? "bg-gray-100"
                                : "bg-red-100"
                        }`}
                    >

                        {remaining >= 0 ? (

                            <ArrowUpRight
                                size={22}
                            />

                        ) : (

                            <ArrowDownRight
                                size={22}
                            />

                        )}

                    </div>

                </div>


                {income > 0 && (

                    <div className="mt-5">

                        <div className="flex justify-between text-xs text-gray-500 mb-2">

                            <span>
                                Money used
                            </span>

                            <span>
                                {Math.min(
                                    (
                                        expenses /
                                        income
                                    ) * 100,
                                    100
                                ).toFixed(1)}
                                %
                            </span>

                        </div>


                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                            <div
                                className="h-full bg-black rounded-full"
                                style={{
                                    width:
                                        `${Math.min(
                                            (
                                                expenses /
                                                income
                                            ) * 100,
                                            100
                                        )}%`
                                }}
                            />

                        </div>

                    </div>

                )}

            </div>


            {/* 50 / 30 / 20 */}

            <div className="bg-white border rounded-2xl p-5 sm:p-6">

                <div className="flex items-start justify-between">

                    <div>

                        <h2 className="text-xl font-bold">
                            50 / 30 / 20 Plan
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Your actual spending against the recommended allocation.
                        </p>

                    </div>

                    <PiggyBank
                        size={23}
                        className="text-gray-400"
                    />

                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

                    {categories.map(
                        (category) => {

                            const actual =
                                categoryTotals[
                                    category.name
                                ];

                            const target =
                                budget[
                                    category.name
                                ];

                            const usage =
                                target > 0
                                    ? (
                                        actual /
                                        target
                                    ) * 100
                                    : 0;


                            return (

                                <div
                                    key={
                                        category.name
                                    }
                                    className="border rounded-2xl p-4"
                                >

                                    <div className="flex justify-between">

                                        <div>

                                            <p className="font-semibold">
                                                {
                                                    category.name
                                                }
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                {
                                                    category.percentage
                                                }
                                                % target
                                            </p>

                                        </div>


                                        <p className="font-bold">
                                            {formatMoney(
                                                actual
                                            )}
                                        </p>

                                    </div>


                                    <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">

                                        <div
                                            className="h-full bg-black rounded-full"
                                            style={{
                                                width:
                                                    `${Math.min(
                                                        usage,
                                                        100
                                                    )}%`
                                            }}
                                        />

                                    </div>


                                    <div className="flex justify-between text-xs text-gray-500 mt-2">

                                        <span>
                                            {usage.toFixed(
                                                0
                                            )}% used
                                        </span>

                                        <span>
                                            {formatMoney(
                                                target
                                            )}
                                        </span>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            </div>


            {/* Charts */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


                {/* Spending chart */}

                <div className="bg-white border rounded-2xl p-5 sm:p-6">

                    <h2 className="text-xl font-bold">
                        Spending Breakdown
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Expense distribution for {monthName}.
                    </p>


                    <div className="h-[320px]">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie
                                    data={
                                        spendingData
                                    }
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={110}
                                    paddingAngle={3}
                                >

                                    {spendingData.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <Cell
                                                key={
                                                    index
                                                }
                                            />

                                        )
                                    )}

                                </Pie>


                                <Tooltip
                                    formatter={(
                                        value
                                    ) =>
                                        formatMoney(
                                            value
                                        )
                                    }
                                />


                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>


                {/* Budget chart */}

                <div className="bg-white border rounded-2xl p-5 sm:p-6">

                    <h2 className="text-xl font-bold">
                        Budget vs Actual
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Recommended allocation compared with actual spending.
                    </p>


                    <div className="h-[320px]">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart
                                data={
                                    budgetData
                                }
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                />

                                <YAxis />

                                <Tooltip
                                    formatter={(
                                        value
                                    ) =>
                                        formatMoney(
                                            value
                                        )
                                    }
                                />

                                <Legend />


                                <Bar
                                    dataKey="Budget"
                                    radius={[
                                        5,
                                        5,
                                        0,
                                        0
                                    ]}
                                />


                                <Bar
                                    dataKey="Actual"
                                    radius={[
                                        5,
                                        5,
                                        0,
                                        0
                                    ]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>


            {/* Recent transactions */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                <RecentIncome
                    data={
                        dashboard.transactions.income
                    }
                    formatMoney={
                        formatMoney
                    }
                />


                <RecentExpenses
                    data={
                        dashboard.transactions.expenses
                    }
                    formatMoney={
                        formatMoney
                    }
                />

            </div>

        </div>
    );
}


/*
 * SUMMARY CARD
 */

function SummaryCard({
    title,
    value,
    description,
    icon
}) {

    return (

        <div className="bg-white border rounded-2xl p-5">

            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">

                {icon}

            </div>


            <p className="text-sm text-gray-500 mt-5">
                {title}
            </p>


            <p className="text-2xl font-bold mt-1">
                {value}
            </p>


            <p className="text-xs text-gray-400 mt-1">
                {description}
            </p>

        </div>
    );
}


/*
 * RECENT INCOME
 */

function RecentIncome({
    data,
    formatMoney
}) {

    return (

        <div className="bg-white border rounded-2xl overflow-hidden">

            <div className="px-5 py-4 border-b">

                <h2 className="font-bold">
                    Recent Income
                </h2>

            </div>


            {data.length === 0 ? (

                <EmptyState text="No income recorded this month." />

            ) : (

                data.map(
                    (item) => (

                        <div
                            key={item._id}
                            className="px-5 py-4 border-b last:border-0 flex items-center justify-between"
                        >

                            <div>

                                <p className="font-medium">
                                    {item.source}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">

                                    {new Date(
                                        item.date
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short"
                                        }
                                    )}

                                </p>

                            </div>


                            <p className="font-semibold">
                                +
                                {formatMoney(
                                    item.amount
                                )}
                            </p>

                        </div>

                    )
                )

            )}

        </div>
    );
}


/*
 * RECENT EXPENSES
 */

function RecentExpenses({
    data,
    formatMoney
}) {

    return (

        <div className="bg-white border rounded-2xl overflow-hidden">

            <div className="px-5 py-4 border-b">

                <h2 className="font-bold">
                    Recent Expenses
                </h2>

            </div>


            {data.length === 0 ? (

                <EmptyState text="No expenses recorded this month." />

            ) : (

                data.map(
                    (item) => (

                        <div
                            key={item._id}
                            className="px-5 py-4 border-b last:border-0 flex items-center justify-between"
                        >

                            <div>

                                <p className="font-medium">
                                    {item.title}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">

                                    {item.category}
                                    {" • "}
                                    {new Date(
                                        item.date
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short"
                                        }
                                    )}

                                </p>

                            </div>


                            <p className="font-semibold">
                                -
                                {formatMoney(
                                    item.amount
                                )}
                            </p>

                        </div>

                    )
                )

            )}

        </div>
    );
}


function EmptyState({ text }) {

    return (

        <div className="p-8 text-center text-sm text-gray-500">

            {text}

        </div>
    );
}


export default Dashboard;