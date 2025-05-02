// WorkoutEditor.tsx
import React from "react";
import axios from "axios";

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

interface Props {
  workout: Workout;
  sets: WorkoutSet[];
  onSetUpdate: (setId: number) => void;
}

const WorkoutEditor: React.FC<Props> = ({ workout, sets, onSetUpdate }) => {
  const updateField = async (setId: number, field: string, value: number | string) => {
    await axios.patch(`https://localhost:8000/workout-set/${setId}`, {
      [field]: value
    });
    onSetUpdate(setId);
  };

  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold">{workout.name}</h3>
      <ul className="ml-6 mt-2 space-y-1">
        {sets.map(set => (
          <li key={set.id} className="flex gap-4 items-center">
            <span className="w-20">Set {set.set_number}</span>
            <input
              type="number"
              className="border p-1 w-20"
              defaultValue={set.reps}
              onBlur={e => updateField(set.id, "reps", Number(e.target.value))}
            />
            <input
              type="number"
              className="border p-1 w-20"
              defaultValue={set.weight_kg ?? 0}
              onBlur={e => updateField(set.id, "weight_kg", Number(e.target.value))}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutEditor;
