import { useEffect, useState } from "react";

import API from "../services/api";

import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

function Reports() {
    const [data, setData] = useState([]);

    const today = new Date();

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    useEffect(() => {
        const load = async () => {

            const response = await API.get(
                `/expenses?month=${month}&year=${year}`
            );

            const expenses = response.data;

            const needs = expenses
                .filter(e => e.type === "needs")
                .reduce(
                    (sum, e) =>
                        sum + Number(e.amount),
                    0
                );

            const wants = expenses
                .filter(e => e.type === "wants")
                .reduce(
                    (sum, e) =>
                        sum + Number(e.amount),
                    0
                );

            const savings = expenses
                .filter(e => e.type === "savings")
                .reduce(
                    (sum, e) =>
                        sum + Number(e.amount),
                    0
                );

            setData([
                {
                    name: "Needs",
                    value: needs
                },
                {
                    name: "Wants",
                    value: wants
                },
                {
                    name: "Savings",
                    value: savings
                }
            ]);
        };

        load();

    }, []);

    return (
        <div className="min-h-screen bg-slate-100 p-6">

            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold">
                    Monthly Report
                </h1>

                <div className="bg-white mt-6 p-6 rounded-2xl">

                    <div className="h-96">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={130}
                                    label
                                />

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Reports;