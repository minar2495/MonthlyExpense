import { useEffect, useState } from "react";

import API from "../services/api";

function Dashboard() {
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState([]);

    const today = new Date();

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const incomeResponse = await API.get(
                `/income?month=${month}&year=${year}`
            );

            const expenseResponse = await API.get(
                `/expenses?month=${month}&year=${year}`
            );

            const totalIncome =
                incomeResponse.data.reduce(
                    (sum, item) =>
                        sum + Number(item.amount),
                    0
                );

            setIncome(totalIncome);
            setExpenses(expenseResponse.data);

        } catch (error) {
            console.error(error);
        }
    };

    const needs = expenses
        .filter(item => item.type === "needs")
        .reduce(
            (sum, item) => sum + Number(item.amount),
            0
        );

    const wants = expenses
        .filter(item => item.type === "wants")
        .reduce(
            (sum, item) => sum + Number(item.amount),
            0
        );

    const savings = expenses
        .filter(item => item.type === "savings")
        .reduce(
            (sum, item) => sum + Number(item.amount),
            0
        );

    const totalExpenses =
        needs + wants + savings;

    const needsBudget = income * 0.50;
    const wantsBudget = income * 0.30;
    const savingsBudget = income * 0.20;

    return (
        <div className="min-h-screen bg-slate-100 p-6">

            <div className="max-w-7xl mx-auto">

                <div className="flex justify-between items-center">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Dashboard
                        </h1>

                        <p className="text-gray-500">
                            {today.toLocaleString(
                                "default",
                                { month: "long" }
                            )} {year}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href =
                                "/login";
                        }}
                        className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>

                </div>

                {/* Income */}

                <div className="mt-8 grid md:grid-cols-4 gap-5">

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p className="text-gray-500">
                            Monthly Income
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            ₹{income.toLocaleString()}
                        </h2>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p className="text-gray-500">
                            Total Expenses
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            ₹{totalExpenses.toLocaleString()}
                        </h2>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p className="text-gray-500">
                            Remaining
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            ₹{(
                                income -
                                totalExpenses
                            ).toLocaleString()}
                        </h2>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <p className="text-gray-500">
                            Savings Rate
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {income
                                ? Math.round(
                                    (savings / income) *
                                    100
                                )
                                : 0}%
                        </h2>
                    </div>

                </div>

                {/* 50 / 30 / 20 */}

                <div className="mt-8">

                    <h2 className="text-2xl font-bold mb-5">
                        50 / 30 / 20 Budget
                    </h2>

                    <div className="grid md:grid-cols-3 gap-5">

                        <BudgetCard
                            title="Needs"
                            percentage="50%"
                            spent={needs}
                            budget={needsBudget}
                        />

                        <BudgetCard
                            title="Wants"
                            percentage="30%"
                            spent={wants}
                            budget={wantsBudget}
                        />

                        <BudgetCard
                            title="Savings"
                            percentage="20%"
                            spent={savings}
                            budget={savingsBudget}
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}

function BudgetCard({
    title,
    percentage,
    spent,
    budget
}) {
    const progress = budget
        ? Math.min((spent / budget) * 100, 100)
        : 0;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">

            <div className="flex justify-between">

                <div>
                    <h3 className="text-xl font-bold">
                        {title}
                    </h3>

                    <p className="text-gray-500">
                        Target {percentage}
                    </p>
                </div>

                <span className="font-bold">
                    ₹{spent.toLocaleString()}
                </span>

            </div>

            <div className="mt-5 h-3 bg-gray-200 rounded-full">

                <div
                    className="h-3 bg-black rounded-full"
                    style={{
                        width: `${progress}%`
                    }}
                />

            </div>

            <div className="flex justify-between mt-3 text-sm">

                <span>
                    Spent ₹{spent.toLocaleString()}
                </span>

                <span>
                    Budget ₹{budget.toLocaleString()}
                </span>

            </div>

        </div>
    );
}

export default Dashboard;