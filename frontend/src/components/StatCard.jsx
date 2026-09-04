function StatCard({
    title,
    value,
    subtitle
}) {
    return (
        <div className="bg-white border rounded-2xl p-5 shadow-sm">

            <p className="text-sm text-gray-500">
                {title}
            </p>

            <h3 className="text-2xl font-bold mt-2 tracking-tight">
                {value}
            </h3>

            {subtitle && (
                <p className="text-xs text-gray-500 mt-2">
                    {subtitle}
                </p>
            )}

        </div>
    );
}

export default StatCard;