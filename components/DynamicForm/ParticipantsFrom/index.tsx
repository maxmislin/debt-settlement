import React, { useState } from "react";
import { useParticipantContext } from "../context";

const ParticipantsFrom: React.FC = () => {
  const {
    participants,
    addParticipant: setParticipants,
    removeParticipant,
  } = useParticipantContext();
  const [name, setName] = useState("");

  const addParticipant = () => {
    if (name === "") {
      alert("Name cannot be empty");
      return;
    }

    const participantId = name.replace(/ /g, "_").toLowerCase();

    if (participants.some((p) => p.id === participantId)) {
      alert(`Participant ${name} already exists`);
      return;
    }

    setParticipants({ id: participantId, name });
    setName("");
  };

  return (
    <div className="py-4 flex flex-col flex-1 lg:w-96">
      <h2 className="text-2xl font-bold mb-4">Add Participants</h2>
      <div className="mb-4 flex">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 mr-2 rounded-md w-3/5 h-10 border-neutral-300 dark:border-gray-600"
        />
        <button
          onClick={addParticipant}
          className="bg-black border-gray-600 border-2 transition-colors hover:bg-gray-600 text-white rounded-md py-2 h-10 px-4 ml-2 flex-1"
        >
          Add
        </button>
      </div>
      <div>
        {participants.map((participant, index) => (
          <span key={index} className="mr-2">
            {participant.name}
            <button
              onClick={() => removeParticipant(participant.id)}
              className="ml-2 text-red-500"
            >
              Remove
            </button>
            {index < participants.length - 1 && ","}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsFrom;
