// SessionList.tsx
import React, { useState } from "react";
import axios from "axios";
import { WorkoutSession } from "./CalendarTab";

interface Props {
  date: Date;
  sessions: WorkoutSession[];
  onSelectSession: (session: WorkoutSession) => void;
  onRefresh: () => void;
}

const userId = 1;

const SessionList: React.FC<Props> = ({ date, sessions, onSelectSession, onRefresh }) => {
  const [newSessionName, setNewSessionName] = useState("");

  const handleCreateSession = async () => {
    if (!newSessionName.trim()) return;
    const iso = date.toISOString().split("T")[0];
    const res = await axios.post("https://localhost:8000/session/", {
      user_id: userId,
      date: iso,
      source: "manual",
      name: newSessionName
    });
    setNewSessionName("");
    onRefresh();
    onSelectSession(res.data);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold">Sessions on selected date</h2>
      <ul className="space-y-2 mt-4">
        {sessions.map(session => (
          <li key={session.id}>
            <button className="text-blue-600 underline" onClick={() => onSelectSession(session)}>
              {session.name}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <input
          type="text"
          placeholder="New session name"
          className="border p-2 w-full"
          value={newSessionName}
          onChange={e => setNewSessionName(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 mt-2 rounded" onClick={handleCreateSession}>
          + Create Session
        </button>
      </div>
    </div>
  );
};

export default SessionList;
