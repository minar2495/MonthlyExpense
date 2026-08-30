import { useEffect, useState } from "react";

import API from "../services/api";

function Income() {
    const [income, setIncome] = useState([]);

    const [form, setForm] = useState({
        amount: "",
        source: ""
    });

    const today = new Date();

    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const loadIncome = async () => {
        const response = await API.get(
            `/income?month=${month}&year=${year}`
        );

        setIncome(response.data);
    };

    useEffect(() => {
        loadIncome();
    }, []);

    const addIncome = async (e) => {
        e.preventDefault();

        await API.post("/income", {
            amount: Number(form.amount),
            source: form.source
        });

        setForm({
            amount: "",
            source: ""
        });

        loadIncome();
    };

    const deleteIncome = async (id) => {
        await API.delete(`/income/${id}`);

        loadIncome();
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold">
                    Income
                </h1>

                <form
                    onSubmit={addIncome}
                    className="bg-white p-6 rounded-2xl mt-6 flex gap-4"
                >

                    <input
                        type="number"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                amount: e.target.value
                            })
                        }
                        className="border p-3 rounded-lg"
                        required
                    />

                    <input
                        placeholder="Income source"
                        value={form.source}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                source: e.target.value
                            })
                        }
                        className="border p-3 rounded-lg"
                        required
                    />

                    <button className="bg-black text-white px-6 rounded-lg">
                        Add Income
                    </button>

                </form>

                <div className="bg-white mt-6 rounded-2xl">

                    {income.map(item => (

                        <div
                            key={item._id}
                            className="p-5 border-b flex justify-between"
                        >

                            <div>
                                <p className="font-semibold">
                                    {item.source}
                                </p>

                                <p className="text-gray-500">
                                    {new Date(
                                        item.date
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex gap-5 items-center">

                                <span className="font-bold">
                                    ₹{item.amount}
                                </span>

                                <button
                                    onClick={() =>
                                        deleteIncome(item._id)
                                    }
                                    className="text-red-500"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default Income;