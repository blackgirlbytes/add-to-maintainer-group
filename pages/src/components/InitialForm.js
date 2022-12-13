import React from "react";
import { isUserEligible} from "../handlers/checkRequirements";
import { inviteUser } from "../handlers/repoActions";

export default function InitialForm({
  username,
  setUsername,
  setShowManualForm,
  owner,
  repo,
}) {

  // function for submit button
  const handleSubmitToJoinRepo = async (event) => {
    event.preventDefault();
    
    const shouldSendInvite = await isUserEligible(
      username
    );
    if (shouldSendInvite) {
      console.log("sending invite");
      await inviteUser(username, owner, repo);
    } else {
      setShowManualForm(true);
    }
  };
  
  return (
    <form onSubmit={handleSubmitToJoinRepo}>
      <label>
        GitHub Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <button type="submit"> Submit </button>
    </form>
  );
}
