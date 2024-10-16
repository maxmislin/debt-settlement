import React, { useState } from "react";
import { useParticipantContext } from "../context";

const ParticipantsFrom: React.FC = () => {
  const { participants, addParticipant: setParticipants } =
    useParticipantContext();
  const [name, setName] = useState("");

  const addParticipant = () => {
    if (name === "") {
      alert("Name cannot be empty");
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
          className="border p-2 mr-2 rounded w-3/5"
        />
        <button
          onClick={addParticipant}
          className="bg-blue-500 text-white py-2 px-4 ml-2 rounded flex-1"
        >
          Add
        </button>
      </div>
      <div>
        {participants.map((participant, index) => (
          <span key={index} className="mr-2">
            {participant.name}
            {index < participants.length - 1 && ","}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsFrom;
