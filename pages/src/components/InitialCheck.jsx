import React, { useState, useEffect } from "react";
import { isUserEligible } from "../handlers/checkRequirements";
import { inviteUser } from "../handlers/repoActions";
import { getUserHandleByEmail } from "../handlers/dataRetrieval";
import Invited from "./Invited";
import AppealForm from "./AppealForm";
export default function InitialCheck({
  username,
  setUsername,
  setShowManualForm,
  owner,
  repo,
  repositoryURL,
  email,
}) {
  const [eligible, setEligibility] = useState("");
  const [handle, setHandle] = useState("");
  useEffect(() => {
    const checkElibiiity = async (email) => {
      const handle = await getUserHandleByEmail(email);
      setHandle(handle);
      const shouldSendInvite = await isUserEligible(handle);
      if (shouldSendInvite) {
        console.log("sending invite");
        await inviteUser(handle, owner, repo);
        setEligibility("true");
      }
    };
    checkElibiiity(email);
  }, [email]);

  return (
    <>
      {eligible ? (
        <Invited handle={handle} />
      ) : (
        <AppealForm
          username={handle}
          repositoryURL={repositoryURL}
          owner={owner}
          repo={repo}
        />
      )}
    </>
    // loading  use effect then show component based on state of eligible

    // <form onSubmit={handleSubmitToJoinRepo}>
    //   <label>
    //     GitHub Username:
    //     <input
    //       type="text"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //     />
    //   </label>
    //   <button type="submit"> Submit </button>
    // </form>
  );
}
