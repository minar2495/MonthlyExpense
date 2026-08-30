function MonthSelector({
    month,
    year,
    onChange
}) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const years = [];

    for (
        let y = 2024;
        y <= 2030;
        y++
    ) {
        years.push(y);
    }

    return (
        <div className="flex gap-2">

            <select
                value={month}
                onChange={(e) =>
                    onChange(
                        Number(e.target.value),
                        year
                    )
                }
                className="border bg-white rounded-xl px-4 py-2"
            >
                {months.map(
                    (name, index) => (
                        <option
                            key={name}
                            value={index + 1}
                        >
                            {name}
                        </option>
                    )
                )}
            </select>

            <select
                value={year}
                onChange={(e) =>
                    onChange(
                        month,
                        Number(e.target.value)
                    )
                }
                className="border bg-white rounded-xl px-4 py-2"
            >
                {years.map(y => (
                    <option
                        key={y}
                        value={y}
                    >
                        {y}
                    </option>
                ))}
            </select>

        </div>
    );
}

export default MonthSelector;