function BudgetCard({
    title,
    rule,
    budget,
    spent,
    remaining
}) {
    const percentage =
        budget > 0
            ? (spent / budget) * 100
            : 0;

    const progress =
        Math.min(percentage, 100);

    const exceeded =
        spent > budget;

    return (
        <div className="bg-white border rounded-2xl p-5 shadow-sm">

            <div className="flex justify-between">

                <div>
                    <h3 className="font-semibold">
                        {title}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {rule} of income
                    </p>
                </div>

                <span className="font-bold">
                    ₹{spent.toLocaleString("en-IN")}
                </span>

            </div>

            <div className="mt-5 h-2 bg-gray-100 rounded-full overflow-hidden">

                <div
                    className={`
                        h-full rounded-full
                        ${exceeded
                            ? "bg-red-500"
                            : "bg-[#9dc83e]"}
                    `}
                    style={{
                        width: `${progress}%`
                    }}
                />

            </div>

            <div className="flex justify-between text-xs mt-3">

                <span>
                    Budget ₹
                    {budget.toLocaleString("en-IN")}
                </span>

                <span
                    className={
                        exceeded
                            ? "text-red-500"
                            : "text-gray-500"
                    }
                >
                    {exceeded
                        ? `₹${Math.abs(remaining).toLocaleString("en-IN")} over`
                        : `₹${remaining.toLocaleString("en-IN")} left`}
                </span>

            </div>

        </div>
    );
}

export default BudgetCard;