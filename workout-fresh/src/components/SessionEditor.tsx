// SessionEditor.tsx
import React from "react";
import axios from "axios";
import { WorkoutSession } from "./CalendarTab";

interface Props {
  session: WorkoutSession;
  onBack: () => void;
  onUpdate: () => void;
}

const SessionEditor: React.FC<Props> = ({ session, onBack, onUpdate }) => {
  const updateWorkoutSet = async (setId: number, field: string, value: number | string) => {
    await axios.patch(`https://localhost:8000/workout-set/${setId}`, {
      [field]: value
    });
    onUpdate();
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h2 className="text-xl font-bold mb-4">Editing Session: {session.name}</h2>
      {session.workouts.map((entry, wIdx) => (
        <div key={wIdx} className="mb-6">
          <h3 className="text-md font-semibold">{entry.workout.name}</h3>
          <ul className="ml-6 mt-2 space-y-1">
            {entry.sets.map(set => (
              <li key={set.id} className="flex gap-4 items-center">
                <span className="w-20">Set {set.set_number}</span>
                <input
                  type="number"
                  className="border p-1 w-20"
                  defaultValue={set.reps}
                  onBlur={e => updateWorkoutSet(set.id, "reps", Number(e.target.value))}
                />
                <input
                  type="number"
                  className="border p-1 w-20"
                  defaultValue={set.weight_kg ?? 0}
                  onBlur={e => updateWorkoutSet(set.id, "weight_kg", Number(e.target.value))}
                />
              </li>
            ))}
          </ul>
          <hr className="my-4" />
        </div>
      ))}
      <button className="text-sm text-gray-600 underline" onClick={onBack}>
        ← Back to sessions list
      </button>
    </div>
  );
};

export default SessionEditor;
