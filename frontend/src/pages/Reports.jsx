import { useEffect, useState } from "react";

import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Wallet,
    PiggyBank,
    ChevronLeft,
    ChevronRight,
    Loader2
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


const categoryInfo = {
    Needs: {
        target: 50
    },

    Wants: {
        target: 30
    },

    Savings: {
        target: 20
    }
};


function Reports() {

    const now = new Date();

    const [year, setYear] =
        useState(now.getFullYear());

    const [month, setMonth] =
        useState(now.getMonth() + 1);


    const [report, setReport] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const monthName =
        new Date(
            year,
            month - 1
        ).toLocaleString(
            "en-IN",
            {
                month: "long"
            }
        );


    const loadReport = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get(
                    "/reports/monthly",
                    {
                        params: {
                            year,
                            month
                        }
                    }
                );

            setReport(response.data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load report."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadReport();
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


    const formatMoney = (value) => {

        return `₹${Number(value || 0).toLocaleString(
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
                        size={30}
                        className="animate-spin mx-auto"
                    />

                    <p className="text-gray-500 mt-3">
                        Generating your report...
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


    if (!report) {
        return null;
    }


    const categories =
        report.expenses.categories;


    const budget =
        report.budget;


    const categoryChartData = [
        {
            name: "Needs",
            value: categories.Needs
        },
        {
            name: "Wants",
            value: categories.Wants
        },
        {
            name: "Savings",
            value: categories.Savings
        }
    ];


    const comparisonData = [
        {
            name: "Needs",
            Budget: budget.Needs,
            Actual: categories.Needs
        },
        {
            name: "Wants",
            Budget: budget.Wants,
            Actual: categories.Wants
        },
        {
            name: "Savings",
            Budget: budget.Savings,
            Actual: categories.Savings
        }
    ];


    const savingsRate =
        report.income.total > 0
            ? (
                report.remaining /
                report.income.total
            ) * 100
            : 0;


    return (

        <div className="space-y-6">


            {/* Header */}

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                <div>

                    <h1 className="text-3xl font-bold">
                        Financial Report
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Understand your money and track your 50/30/20 plan.
                    </p>

                </div>


                {/* Month selector */}

                <div className="flex items-center bg-white border rounded-xl p-1">

                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >

                        <ChevronLeft
                            size={19}
                        />

                    </button>


                    <div className="min-w-[150px] text-center">

                        <p className="font-semibold">
                            {monthName}
                        </p>

                        <p className="text-xs text-gray-500">
                            {year}
                        </p>

                    </div>


                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg"
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
                    title="Total Income"
                    value={formatMoney(
                        report.income.total
                    )}
                    icon={<TrendingUp size={20} />}
                    description="Money received"
                />


                <SummaryCard
                    title="Total Expenses"
                    value={formatMoney(
                        report.expenses.total
                    )}
                    icon={<TrendingDown size={20} />}
                    description="Money spent"
                />


                <SummaryCard
                    title="Remaining"
                    value={formatMoney(
                        report.remaining
                    )}
                    icon={<Wallet size={20} />}
                    description="Income minus expenses"
                />


                <SummaryCard
                    title="Savings Rate"
                    value={`${Math.max(
                        savingsRate,
                        0
                    ).toFixed(1)}%`}
                    icon={<PiggyBank size={20} />}
                    description="Target: 20%"
                />

            </div>


            {/* 50/30/20 */}

            <div className="bg-white border rounded-2xl p-5 sm:p-6">

                <div className="flex items-center justify-between mb-6">

                    <div>

                        <h2 className="text-xl font-bold">
                            50 / 30 / 20 Budget
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Actual spending compared with your recommended allocation.
                        </p>

                    </div>

                    <BarChart3
                        size={22}
                        className="text-gray-400"
                    />

                </div>


                <div className="space-y-6">

                    {Object.keys(categoryInfo).map(
                        (category) => {

                            const actual =
                                categories[category];

                            const target =
                                budget[category];

                            const targetPercent =
                                categoryInfo[
                                    category
                                ].target;

                            const usedPercent =
                                target > 0
                                    ? Math.min(
                                        (
                                            actual /
                                            target
                                        ) * 100,
                                        100
                                    )
                                    : 0;


                            return (

                                <div key={category}>

                                    <div className="flex justify-between items-end mb-2">

                                        <div>

                                            <p className="font-semibold">
                                                {category}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Target {targetPercent}%
                                            </p>

                                        </div>


                                        <div className="text-right">

                                            <p className="font-bold">
                                                {formatMoney(
                                                    actual
                                                )}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                of{" "}
                                                {formatMoney(
                                                    target
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">

                                        <div
                                            className="h-full bg-black rounded-full transition-all"
                                            style={{
                                                width:
                                                    `${usedPercent}%`
                                            }}
                                        />

                                    </div>


                                    <div className="flex justify-between text-xs text-gray-500 mt-2">

                                        <span>
                                            {usedPercent.toFixed(
                                                0
                                            )}% used
                                        </span>

                                        <span>
                                            {actual >
                                            target
                                                ? `₹${(
                                                    actual -
                                                    target
                                                ).toLocaleString(
                                                    "en-IN"
                                                )} over`
                                                : `₹${(
                                                    target -
                                                    actual
                                                ).toLocaleString(
                                                    "en-IN"
                                                )} remaining`}
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


                {/* Pie chart */}

                <div className="bg-white border rounded-2xl p-5 sm:p-6">

                    <h2 className="text-xl font-bold">
                        Spending Breakdown
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Where your money went this month.
                    </p>


                    <div className="h-[320px] mt-4">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie
                                    data={
                                        categoryChartData
                                    }
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={105}
                                    innerRadius={60}
                                    paddingAngle={3}
                                >

                                    {categoryChartData.map(
                                        (
                                            entry,
                                            index
                                        ) => (
                                            <Cell
                                                key={
                                                    `cell-${index}`
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


                {/* Bar chart */}

                <div className="bg-white border rounded-2xl p-5 sm:p-6">

                    <h2 className="text-xl font-bold">
                        Budget vs Actual
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Compare your plan with actual spending.
                    </p>


                    <div className="h-[320px] mt-4">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart
                                data={
                                    comparisonData
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


            {/* Transactions */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


                <TransactionList
                    title="Recent Income"
                    transactions={
                        report.income.transactions
                    }
                    type="income"
                />


                <TransactionList
                    title="Recent Expenses"
                    transactions={
                        report.expenses.transactions
                    }
                    type="expense"
                />

            </div>

        </div>
    );
}


function SummaryCard({
    title,
    value,
    icon,
    description
}) {

    return (

        <div className="bg-white border rounded-2xl p-5">

            <div className="flex items-center justify-between">

                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    {icon}
                </div>

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


function TransactionList({
    title,
    transactions,
    type
}) {

    return (

        <div className="bg-white border rounded-2xl overflow-hidden">

            <div className="px-5 py-4 border-b">

                <h2 className="font-bold">
                    {title}
                </h2>

            </div>


            {transactions.length === 0 ? (

                <div className="p-8 text-center text-sm text-gray-500">
                    No transactions this month.
                </div>

            ) : (

                <div>

                    {transactions.map(
                        (item) => (

                            <div
                                key={item._id}
                                className="px-5 py-4 border-b last:border-0 flex items-center justify-between"
                            >

                                <div>

                                    <p className="font-medium">

                                        {type === "income"
                                            ? item.source
                                            : item.title}

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

                                        {type === "expense" &&
                                            ` • ${item.category}`}

                                    </p>

                                </div>


                                <p className="font-semibold">

                                    {type === "income"
                                        ? "+"
                                        : "-"}
                                    ₹
                                    {Number(
                                        item.amount
                                    ).toLocaleString(
                                        "en-IN"
                                    )}

                                </p>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}


export default Reports;