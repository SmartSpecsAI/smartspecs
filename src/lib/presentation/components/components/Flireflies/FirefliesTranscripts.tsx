"use client";

import { useState } from "react";

const FirefliesTranscripts = () => {
    const [transcriptId, setTranscriptId] = useState<string>('');
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

    const fetchTranscript = async (id: string) => {
        try {
            const res = await fetch(`/api/fireflies/transcripts?id=${id}`);
            if (!res.ok) throw new Error("Error al obtener la transcripción");

            const data = await res.json();
            console.log("Respuesta de la API:", data);
            setTranscript(data.data.transcript);
        } catch (error: any) {
            console.error("Error fetching transcript:", error);
            setError(error.message);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTranscript(transcriptId);
    };

    return (
        <div className="p-6 w-full mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📜 Transcripción de Fireflies</h2>

            <form onSubmit={handleSubmit} className="mb-6 flex items-center gap-3">
                <input
                    type="text"
                    value={transcriptId}
                    onChange={(e) => setTranscriptId(e.target.value)}
                    placeholder="Ingrese el ID de la transcripción"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-lg font-medium shadow-md"
                >
                    🔍 Obtener
                </button>
            </form>

            {error && <p className="text-red-500 font-semibold">{error}</p>}

            {transcript && (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg">{transcript.title}</h3>
                        <p className="text-gray-500 text-sm">🗓 {transcript.date}</p>
                        <p className="text-gray-600 text-sm">📩 {transcript.organizer_email}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border shadow-sm">
                            <h4 className="font-semibold text-gray-700">📌 Información</h4>
                            <p className="text-sm text-gray-600">🆔 ID: {transcript.id}</p>
                            <p className="text-sm text-gray-600">🔗 <a href={transcript.meeting_link} className="text-blue-600 hover:underline">Ver reunión</a></p>
                            <p className="text-sm text-gray-600">📄 <a href={transcript.transcript_url} className="text-blue-600 hover:underline">Ver transcripción</a></p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg border shadow-sm">
                            <h4 className="font-semibold text-gray-700">🗣 Oradores</h4>
                            <ul className="max-h-24 overflow-auto text-sm text-gray-600">
                                {transcript.speakers.map(speaker => (
                                    <li key={speaker.id} className="py-1 border-b">
                                        {speaker.name} <span className="text-gray-400">(ID: {speaker.id})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-gray-700">📝 Frases</h4>
                        <ul className="max-h-32 overflow-auto text-sm text-gray-600">
                            {transcript.sentences.map(sentence => (
                                <li key={sentence.index} className="py-1 border-b">
                                    <span className="font-semibold">{sentence.speaker_name}:</span> {sentence.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border shadow-sm">
                        <h4 className="font-semibold text-gray-700">📢 Resumen</h4>
                        <p className="text-sm text-gray-600"><strong>📋 Resumen:</strong> {transcript.summary?.short_summary}</p>
                        <p className="text-sm text-gray-600"><strong>📌 Temas:</strong> {transcript.summary?.topics_discussed?.join(', ')}</p>
                        <p className="text-sm text-gray-600"><strong>🔑 Palabras clave:</strong> {transcript.summary?.keywords?.join(', ')}</p>
                        <p className="text-sm text-gray-600"><strong>✅ Acciones:</strong> {Array.isArray(transcript.summary?.action_items) ? transcript.summary.action_items.join(', ') : 'N/A'}</p>
                    </div>
                </div>
            ) }
        </div>
    );
};

export default FirefliesTranscripts;