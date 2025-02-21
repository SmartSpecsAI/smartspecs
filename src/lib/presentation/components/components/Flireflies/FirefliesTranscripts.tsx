"use client";

import { useState, useEffect } from "react";

const FirefliesTranscripts = () => {
    const [transcript, setTranscript] = useState<{
        id: string;
        transcript_id: string;
        user_id: string;
        app_id: string;
        created_at: string;
        title: string;
        prompt: string;
        response: string;
        minutes_consumed: number;
        date: string;
        fireflies_users: string[];
        organizer_email: string;
        meeting_link: string;
        transcript_url: string;
        speakers: { id: string; name: string }[];
        sentences: { index: number; speaker_name: string; text: string }[];
        summary: {
            short_summary: string;
            topics_discussed: string[];
            keywords: string[];
            action_items: string[];
        };
    } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/fireflies/transcripts");
                if (!res.ok) throw new Error("Error al obtener usuario");

                const data = await res.json();
                console.log("Respuesta de la API:", data);
                setTranscript(data.data.transcript);
            } catch (error: any) {
                console.error("Error fetching user:", error);
                setError(error.message);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold">Transcripción de Fireflies</h2>

            {error && <p className="text-red-500">Error: {error}</p>}

            <ul className="mt-4">
                {transcript ? (
                    <>
                        <li className="p-2 border-b">Título: {transcript.title}</li>
                        <li className="p-2 border-b">ID: {transcript.id}</li>
                        <li className="p-2 border-b">Fecha: {transcript.date}</li>
                        <li className="p-2 border-b">Email del Organizador: {transcript.organizer_email}</li>
                        <li className="p-2 border-b">Link de la Reunión: {transcript.meeting_link}</li>
                        <li className="p-2 border-b">URL de la Transcripción: {transcript.transcript_url}</li>
                        <li className="p-2 border-b">Usuarios de Fireflies: {transcript.fireflies_users?.join(', ')}</li>
                        <li className="p-2 border-b">
                            Oradores:
                            <ul className="ml-4">
                                {transcript.speakers?.map(speaker => (
                                    <li key={speaker.id}>
                                        {speaker.name} (ID: {speaker.id})
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="p-2 border-b">
                            Frases:
                            <ul className="ml-4">
                                {transcript.sentences?.map(sentence => (
                                    <li key={sentence.index}>
                                        {sentence.speaker_name}: {sentence.text}
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li className="p-2 border-b">
                            Resumen:
                            <ul className="ml-4">
                                <li>Resumen Corto: {transcript.summary?.short_summary}</li>
                                <li>Temas Discutidos: {transcript.summary?.topics_discussed?.join(', ')}</li>
                                <li>Palabras Clave: {transcript.summary?.keywords?.join(', ')}</li>
                                <li>Elementos de Acción: {Array.isArray(transcript.summary?.action_items) ? transcript.summary.action_items.join(', ') : 'N/A'}</li>
                            </ul>
                        </li>
                    </>
                ) : (
                    <p>Cargando usuario...</p>
                )}
            </ul>
        </div>
    );
};

export default FirefliesTranscripts;