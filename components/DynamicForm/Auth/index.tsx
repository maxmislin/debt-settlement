import React from "react";
import { useParticipantContext } from "../context";

const Auth: React.FC = () => {
  const { loadPrivateData, setPassword, password } = useParticipantContext();

  return (
    <div className="py-4 flex flex-col flex-1 lg:w-96">
      <h2 className="text-2xl font-bold mb-4">Enter Password</h2>
      <div className="mb-4 flex">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-2 mr-2 rounded-md w-3/5 h-10 border-neutral-300"
        />
        <button
          onClick={loadPrivateData}
          className="bg-black border-gray-600 border-2 transition-colors hover:bg-gray-600 text-white rounded-md py-2 h-10 px-4 ml-2 flex-1"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Auth;
