import React from "react";

interface RequirementHistoryProps {
    histories: any[];
}

const RequirementHistory: React.FC<RequirementHistoryProps> = ({ histories }) => {
    if (histories.length === 0) {
        return <p className="text-gray-500 italic text-sm">No history.</p>;
    }

    return (
        <div className="space-y-4">
            {histories
                .sort((a, b) =>
                    (a.changedAt?.seconds ?? 0) < (b.changedAt?.seconds ?? 0) ? 1 : -1
                )
                .map((entry) => (
                    <div
                        key={entry.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-700">
                                <span className="text-gray-500">Modified by</span>{" "}
                                <span className="font-semibold">{entry.changedBy ?? "Unknown"}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                                {entry.changedAt?.seconds ? new Date(entry.changedAt.seconds * 1000).toLocaleString() : ""}
                            </p>
                        </div>

                        <ul className="space-y-2">
                            {(entry.fields || []).map((fieldChange: any, idx: number) => {
                                const { field, previousValue, newValue } = fieldChange;

                                // Definir estilos por tipo de campo
                                let colorClasses = "text-gray-700"; // Default
                                if (field === "status") colorClasses = "text-blue-600 font-semibold";
                                if (field === "priority") colorClasses = "text-red-500 font-semibold";
                                if (field === "responsible") colorClasses = "text-green-600 font-semibold";

                                return (
                                    <li
                                        key={idx}
                                        className="flex items-start transition-all duration-200 ease-in-out hover:bg-gray-50 rounded-md p-1"
                                    >
                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs mr-2 mt-0.5">
                                            →
                                        </span>
                                        <div>
                                            <span className={`${colorClasses} text-sm capitalize`}>
                                                {field}
                                            </span>:&nbsp;
                                            <span className="text-sm line-through text-red-400">{previousValue}</span>{" "}
                                            →
                                            <span className="text-sm text-green-600 ml-1">{newValue}</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        {entry.reason && (
                            <div className="mt-3 p-2 bg-blue-50 rounded-md transition-all duration-200 ease-in-out hover:bg-blue-100">
                                <p className="text-sm text-blue-700 flex items-center">
                                    <span className="mr-2">💡</span>
                                    {entry.reason}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
};

export default RequirementHistory;