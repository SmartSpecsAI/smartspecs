"use client";

import { useState } from "react";

const FirefliesUsers = () => {
    const [userId, setUserId] = useState<string>('');
    const [user, setUser] = useState<{
        user_id: string;
        recent_transcript: string;
        recent_meeting: string;
        num_transcripts: number;
        name: string;
        minutes_consumed: number;
        is_admin: boolean;
        integrations: string[];
        email: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async (id: string) => {
        try {
            const res = await fetch(`/api/fireflies/users?userId=${id}`);
            if (!res.ok) throw new Error("Error al obtener usuario");

            const data = await res.json();
            console.log("Respuesta de la API:", data);
            setUser(data.data.user);
        } catch (error: any) {
            console.error("Error fetching user:", error);
            setError(error.message);
        }
    };

    const handleSearch = () => {
        if (userId) fetchUser(userId);
    };

    return (
        <div className="w-full p-6 mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 Información del Usuario</h2>

            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Ingrese ID de usuario"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg font-medium shadow-md"
                >
                    🔍 Buscar
                </button>
            </div>

            {error && <p className="text-red-500 font-semibold">{error}</p>}

            {user && (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-gray-500 text-sm">📩 {user.email}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border shadow-sm">
                            <h4 className="font-semibold text-gray-700">📌 Detalles del Usuario</h4>
                            <p className="text-sm text-gray-600">🆔 ID: {user.user_id}</p>
                            <p className="text-sm text-gray-600">⏳ Minutos Consumidos: {user.minutes_consumed}</p>
                            <p className="text-sm text-gray-600">
                                🔑 Rol: <span className={user.is_admin ? "text-green-600 font-semibold" : "text-gray-600"}>{user.is_admin ? "Administrador" : "Usuario Normal"}</span>
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border shadow-sm">
                            <h4 className="font-semibold text-gray-700">🔗 Integraciones Activas</h4>
                            <ul className="max-h-24 overflow-auto text-sm text-gray-600">
                                {user.integrations.length > 0 ? (
                                    user.integrations.map((integration, index) => (
                                        <li key={index} className="py-1 border-b">{integration}</li>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No hay integraciones</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-gray-700">📄 Transcripciones</h4>
                        <p className="text-sm text-gray-600">📝 Última Transcripción: {user.recent_transcript || "No disponible"}</p>
                        <p className="text-sm text-gray-600">📅 Última Reunión: {user.recent_meeting || "No disponible"}</p>
                        <p className="text-sm text-gray-600">📊 Total Transcripciones: {user.num_transcripts}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirefliesUsers;