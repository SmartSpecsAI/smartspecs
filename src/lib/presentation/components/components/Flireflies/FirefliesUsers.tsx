"use client";

import { useState, useEffect } from "react";

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
        if (userId) {
            fetchUser(userId);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Usuario de Fireflies</h2>

            <input 
                type="text" 
                value={userId} 
                onChange={(e) => setUserId(e.target.value)} 
                placeholder="Ingrese ID de usuario" 
                className="border p-2"
            />
            <button onClick={handleSearch} className="ml-2 p-2 bg-blue-500 text-white">Buscar</button>

            {error && <p className="text-red-500">Error: {error}</p>}

            <ul className="mt-4">
                {user ? (
                    <>
                        <li className="p-2 border-b">Nombre: {user.name}</li>
                        <li className="p-2 border-b">Email: {user.email}</li>
                        <li className="p-2 border-b">ID de Usuario: {user.user_id}</li>
                        <li className="p-2 border-b">Transcripción Reciente: {user.recent_transcript}</li>
                        <li className="p-2 border-b">Reunión Reciente: {user.recent_meeting}</li>
                        <li className="p-2 border-b">Número de Transcripciones: {user.num_transcripts}</li>
                        <li className="p-2 border-b">Minutos Consumidos: {user.minutes_consumed}</li>
                    </>
                ) : (
                    <p>Cargando usuario...</p>
                )}
            </ul>
        </div>
    );
};

export default FirefliesUsers;