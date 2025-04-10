"use client";
import Link from "next/link";
import React from "react";
import { Meeting } from "@/smartspecs/app-lib/redux/slices/MeetingsSlice";

interface Props {
  meetings: Meeting[];
}

const MeetingList: React.FC<Props> = ({ meetings }) => {
  if (!meetings.length) {
    return <p className="text-center">No hay reuniones registradas para este proyecto.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white shadow-md rounded">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Título
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Descripción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {meetings.map((m) => (
            <tr key={m.meetingId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{m.meetingTitle}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {m.meetingDescription || "—"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/meetings/${m.meetingId}`}
                  className="text-primary hover:underline"
                >
                  Ver detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MeetingList;