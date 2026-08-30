import { useEffect, useState } from "react";

import API from "../services/api";

function Expenses() {
    const [expenses, setExpenses] = useState([]);

    const [form, setForm] = useState({
        amount: "",
        description: "",
        category: "",
        type: "needs",
        date: new Date().toISOString().split("T")[0]
    });

    const today = new Date();

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const loadExpenses = async () => {
        const response = await API.get(
            `/expenses?month=${month}&year=${year}`
        );

        setExpenses(response.data);
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addExpense = async (e) => {
        e.preventDefault();

        await API.post("/expenses", {
            ...form,
            amount: Number(form.amount)
        });

        setForm({
            amount: "",
            description: "",
            category: "",
            type: "needs",
            date: new Date().toISOString().split("T")[0]
        });

        loadExpenses();
    };

    const deleteExpense = async (id) => {
        await API.delete(`/expenses/${id}`);

        loadExpenses();
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold">
                    Expenses
                </h1>

                <form
                    onSubmit={addExpense}
                    className="bg-white p-6 rounded-2xl mt-6 grid md:grid-cols-5 gap-4"
                >

                    <input
                        name="amount"
                        type="number"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        name="category"
                        placeholder="Category"
                        value={form.category}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                        required
                    />

                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                    >
                        <option value="needs">
                            Needs - 50%
                        </option>

                        <option value="wants">
                            Wants - 30%
                        </option>

                        <option value="savings">
                            Savings - 20%
                        </option>
                    </select>

                    <button className="bg-black text-white rounded-lg">
                        Add Expense
                    </button>

                </form>

                <div className="bg-white rounded-2xl mt-6 overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>
                                <th className="p-4 text-left">
                                    Description
                                </th>

                                <th className="p-4 text-left">
                                    Category
                                </th>

                                <th className="p-4 text-left">
                                    Type
                                </th>

                                <th className="p-4 text-left">
                                    Amount
                                </th>

                                <th className="p-4">
                                    Action
                                </th>
                            </tr>

                        </thead>

                        <tbody>

                            {expenses.map(expense => (

                                <tr
                                    key={expense._id}
                                    className="border-t"
                                >

                                    <td className="p-4">
                                        {expense.description}
                                    </td>

                                    <td className="p-4">
                                        {expense.category}
                                    </td>

                                    <td className="p-4 capitalize">
                                        {expense.type}
                                    </td>

                                    <td className="p-4">
                                        ₹{expense.amount}
                                    </td>

                                    <td className="p-4 text-center">

                                        <button
                                            onClick={() =>
                                                deleteExpense(
                                                    expense._id
                                                )
                                            }
                                            className="text-red-500"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default Expenses;