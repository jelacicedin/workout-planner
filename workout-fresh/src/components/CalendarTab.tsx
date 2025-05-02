// CalendarTab.tsx
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import SessionList from "./SessionList";
import SessionEditor from "./SessionEditor";

interface WorkoutSet {
  id: number;
  set_number: number;
  reps?: number;
  duration_seconds?: number;
  weight_kg?: number;
}

interface Workout {
  id: number;
  name: string;
  workout_type: string;
  input_mode: string;
  description?: string;
  notes?: string;
}

interface WorkoutWithSets {
  workout: Workout;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: number;
  name: string;
  workouts: WorkoutWithSets[];
}

const userId = 1;

const CalendarTab: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [workoutDates, setWorkoutDates] = useState<string[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  const fetchWorkoutDays = async () => {
    const res = await axios.get<{ date: string }[]>(`https://localhost:8000/workout-days/?user_id=${userId}`);
    setWorkoutDates(res.data.map(d => d.date));
  };

  const fetchSessions = async (date: Date) => {
    try {
      const iso = date.toISOString().split("T")[0];
      const res = await axios.get<WorkoutSession[]>(`https://localhost:8000/session/full/${userId}/${iso}`);
      setSessions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      setSessions([]);
    }
    setSelectedSession(null);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    fetchSessions(date);
  };

  useEffect(() => {
    fetchWorkoutDays();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Workout Calendar</h1>
      <Calendar
        onClickDay={handleDayClick}
        value={selectedDate ?? new Date()}
        tileClassName={({ date }) => {
          const iso = date.toISOString().split("T")[0];
          return workoutDates.includes(iso) ? "bg-green-200" : "";
        }}
      />

      {selectedDate && !selectedSession && (
        <SessionList
          date={selectedDate}
          sessions={sessions}
          onSelectSession={setSelectedSession}
          onRefresh={() => fetchSessions(selectedDate)}
        />
      )}

      {selectedSession && (
        <SessionEditor
          session={selectedSession}
          onBack={() => setSelectedSession(null)}
          onUpdate={() => selectedDate && fetchSessions(selectedDate)}
        />
      )}
    </div>
  );
};

export default CalendarTab;
