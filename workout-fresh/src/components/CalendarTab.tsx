import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

interface WorkoutDay {
  id: number;
  user_id: number;
  date: string;
}

interface WorkoutSet {
  workout: { name: string };
  reps?: number;
  weight_kg?: number;
}

const userId = 1;

const CalendarTab: React.FC = () => {
  const [value, setValue] = useState<Date>(new Date());
  const [workoutDates, setWorkoutDates] = useState<string[]>([]);
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);

  const fetchWorkoutDays = async () => {
    try {
      const res = await axios.get<WorkoutDay[]>(
        `https://localhost:8000/workout-days/?user_id=${userId}`
      );
      const dates = res.data.map((d) => d.date);
      setWorkoutDates(dates);
    } catch (err) {
      console.error("Error fetching workout days", err);
    }
  };

  const fetchWorkoutSets = async (selectedDate: Date) => {
    const isoDate = selectedDate.toISOString().split("T")[0];
    try {
      const res = await axios.get<WorkoutSet[]>(
        `https://localhost:8000/workout-sets/${userId}/${isoDate}`
      );
      setWorkoutSets(res.data);
    } catch (err) {
      console.error("Failed to fetch workouts", err);
      setWorkoutSets([]);
    }
  };

  const handleDayClick = async (date: Date) => {
    const isoDate = date.toISOString().split("T")[0];
    if (!workoutDates.includes(isoDate)) {
      try {
        await axios.post("https://localhost:8000/workout-days/", {
          user_id: userId,
          date: isoDate,
        });
        setWorkoutDates([...workoutDates, isoDate]);
      } catch (err) {
        console.error("Error creating workout day", err);
      }
    }
    setValue(date);
    await fetchWorkoutSets(date);
  };

  const tileClassName = ({ date, view }: any) => {
    if (view === "month") {
      const iso = date.toISOString().split("T")[0];
      if (workoutDates.includes(iso)) {
        return "bg-green-200";
      }
    }
    return null;
  };

  useEffect(() => {
    fetchWorkoutDays();
    fetchWorkoutSets(value);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Workout Calendar</h2>
      <Calendar
        onClickDay={handleDayClick}
        value={value}
        tileClassName={tileClassName}
      />
      <div className="mt-6">
        <h3 className="font-bold">Workouts for {value.toDateString()}:</h3>
        {workoutSets.length === 0 ? (
          <p>No workouts logged.</p>
        ) : (
          <ul className="list-disc pl-5 mt-2">
            {workoutSets.map((set, idx) => (
              <li key={idx}>
                {set.workout.name}: {set.reps ?? ''} reps{" "}
                {set.weight_kg ? `@ ${set.weight_kg}kg` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CalendarTab;
