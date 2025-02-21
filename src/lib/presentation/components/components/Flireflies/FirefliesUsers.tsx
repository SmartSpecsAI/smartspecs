"use client";

import { useState, useEffect } from "react";

const FirefliesUsers = () => {
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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/fireflies/users");
                if (!res.ok) throw new Error("Error al obtener usuario");

                const data = await res.json();
                console.log("Respuesta de la API:", data);
                setUser(data.data.user);
            } catch (error: any) {
                console.error("Error fetching user:", error);
                setError(error.message);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Usuario de Fireflies</h2>

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