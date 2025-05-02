import React, { useState, useEffect } from "react";
import axios from "axios";

type UserProfile = {
  id?: number;
  name: string;
  height_cm?: number;
  weight_kg?: number;
  body_fat_percent?: number;
  sex?: string;
  goal?: string;
  experience?: string;
  constraints?: string;
  equipment?: string;
  photo_path?: string;
};

const defaultProfile: UserProfile = {
  name: "",
  height_cm: undefined,
  weight_kg: undefined,
  body_fat_percent: undefined,
  sex: "",
  goal: "",
  experience: "",
  constraints: "",
  equipment: "",
};

export const ProfileTab = () => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    axios
      .get("https://localhost:8000/users/1")
      .then((res) => {
        setProfile(res.data);
      })
      .catch(() => {
        console.log("No existing user profile found.");
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Submitting user profile:", profile);
    axios.post("https://localhost:8000/users/", profile).then((res) => {
      setProfile(res.data);
    });
  };

  return (
    <div className="max-w-2xl space-y-4">
      <input
        name="name"
        placeholder="Name"
        className="input"
        value={profile.name}
        onChange={handleChange}
      />
      <input
        name="height_cm"
        placeholder="Height (cm)"
        className="input"
        value={profile.height_cm || ""}
        onChange={handleChange}
      />
      <input
        name="weight_kg"
        placeholder="Weight (kg)"
        className="input"
        value={profile.weight_kg || ""}
        onChange={handleChange}
      />
      <input
        name="body_fat_percent"
        placeholder="Body Fat (%)"
        className="input"
        value={profile.body_fat_percent || ""}
        onChange={handleChange}
      />
      <input
        name="sex"
        placeholder="Sex"
        className="input"
        value={profile.sex || ""}
        onChange={handleChange}
      />
      <input
        name="goal"
        placeholder="Goal"
        className="input"
        value={profile.goal || ""}
        onChange={handleChange}
      />
      <input
        name="experience"
        placeholder="Experience"
        className="input"
        value={profile.experience || ""}
        onChange={handleChange}
      />
      <input
        name="constraints"
        placeholder="Constraints"
        className="input"
        value={profile.constraints || ""}
        onChange={handleChange}
      />
      <input
        name="equipment"
        placeholder="Equipment"
        className="input"
        value={profile.equipment || ""}
        onChange={handleChange}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Save Profile
      </button>
    </div>
  );
};
