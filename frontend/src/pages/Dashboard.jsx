import {
    useEffect,
    useState
} from "react";

import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import api from "../services/api";

import StatCard from "../components/StatCard";
import BudgetCard from "../components/BudgetCard";
import MonthSelector from "../components/MonthSelector";

function getDateRange(
    month,
    year
) {
    const start =
        new Date(
            year,
            month - 1,
            1
        );

    const end =
        new Date(
            year,
            month,
            1
        );

    return {
        startDate:
            start.toISOString(),

        endDate:
            end.toISOString()
    };
}

function Dashboard() {
    const today = new Date();

    const [month, setMonth] =
        useState(
            today.getMonth() + 1
        );

    const [year, setYear] =
        useState(
            today.getFullYear()
        );

    const [data, setData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const loadDashboard =
        async () => {
            try {
                setLoading(true);

                const {
                    startDate,
                    endDate
                } =
                    getDateRange(
                        month,
                        year
                    );

                const response =
                    await api.get(
                        "/dashboard",
                        {
                            params: {
                                startDate,
                                endDate
                            }
                        }
                    );

                setData(
                    response.data
                );

            } catch (error) {
                console.error(
                    error
                );
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        loadDashboard();
    }, [month, year]);

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading dashboard...
            </div>
        );
    }

    if (!data) {
        return (
            <div>
                Unable to load dashboard.
            </div>
        );
    }

    const chartData = [
        {
            name: "Needs",
            value: data.spent.needs
        },
        {
            name: "Wants",
            value: data.spent.wants
        },
        {
            name: "Savings",
            value: data.spent.savings
        }
    ];

    return (
        <div className="space-y-8">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div>
                    <h1 className="text-3xl font-bold">
                        Dashboard
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Track your monthly budget
                    </p>
                </div>

                <MonthSelector
                    month={month}
                    year={year}
                    onChange={(
                        newMonth,
                        newYear
                    ) => {
                        setMonth(
                            newMonth
                        );

                        setYear(
                            newYear
                        );
                    }}
                />

            </div>

            {/* Stats */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <StatCard
                    title="Monthly Income"
                    value={`₹${data.income.toLocaleString("en-IN")}`}
                />

                <StatCard
                    title="Total Expenses"
                    value={`₹${data.totalExpenses.toLocaleString("en-IN")}`}
                />

                <StatCard
                    title="Balance"
                    value={`₹${data.balance.toLocaleString("en-IN")}`}
                />

                <StatCard
                    title="Savings"
                    value={`₹${data.spent.savings.toLocaleString("en-IN")}`}
                    subtitle={`${data.percentages.savings.toFixed(1)}% of income`}
                />

            </div>

            {/* Budget */}

            <section>

                <div className="mb-4">
                    <h2 className="text-xl font-bold">
                        50 / 30 / 20 Budget
                    </h2>

                    <p className="text-sm text-gray-500">
                        Your budget is calculated from
                        total monthly income.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-4">

                    <BudgetCard
                        title="Needs"
                        rule="50%"
                        budget={
                            data.budgets.needs
                        }
                        spent={
                            data.spent.needs
                        }
                        remaining={
                            data.remaining.needs
                        }
                    />

                    <BudgetCard
                        title="Wants"
                        rule="30%"
                        budget={
                            data.budgets.wants
                        }
                        spent={
                            data.spent.wants
                        }
                        remaining={
                            data.remaining.wants
                        }
                    />

                    <BudgetCard
                        title="Savings"
                        rule="20%"
                        budget={
                            data.budgets.savings
                        }
                        spent={
                            data.spent.savings
                        }
                        remaining={
                            data.remaining.savings
                        }
                    />

                </div>

            </section>

            {/* Charts */}

            <div className="grid lg:grid-cols-2 gap-5">

                <div className="bg-white border rounded-2xl p-5">

                    <h2 className="font-bold">
                        Spending Distribution
                    </h2>

                    <div className="h-80">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <PieChart>

                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={110}
                                    label
                                />

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                <div className="bg-white border rounded-2xl p-5">

                    <h2 className="font-bold">
                        Top Categories
                    </h2>

                    <div className="mt-5 space-y-4">

                        {data.categories
                            .slice(0, 6)
                            .map(item => (
                                <div
                                    key={item.category}
                                    className="flex justify-between"
                                >
                                    <span>
                                        {item.category}
                                    </span>

                                    <span className="font-semibold">
                                        ₹
                                        {item.amount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>
                            ))}

                        {data.categories.length === 0 && (
                            <p className="text-gray-500">
                                No expenses this month.
                            </p>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;