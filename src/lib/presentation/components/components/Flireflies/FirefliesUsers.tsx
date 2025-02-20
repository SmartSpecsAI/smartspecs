"use client";

import { useState, useEffect } from "react";

const FirefliesUsers = () => {
    const [users, setUsers] = useState<{ name: string; user_id: string }[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/fireflies/users");
                if (!res.ok) throw new Error("Error al obtener usuarios");

                const data = await res.json();
                setUsers(data.data.users);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Usuarios de Fireflies</h2>

            {error && <p className="text-red-500">Error: {error}</p>}

            <ul className="mt-4">
                {users.length > 0 ? (
                    users.map((user) => (
                        <li key={user.user_id} className="p-2 border-b">
                            {user.name} (ID: {user.user_id})
                        </li>
                    ))
                ) : (
                    <p>Cargando usuarios...</p>
                )}
            </ul>
        </div>
    );
};

export default FirefliesUsers;