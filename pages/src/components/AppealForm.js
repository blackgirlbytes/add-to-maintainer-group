import React from "react";
import { useState } from "react";
import { openIssue } from "../handlers/repoActions";

export default function AppealForm({owner, repo, username, repositoryURL}) {
  const [appeal, setAppeal] = useState(null);

  const handleSubmitToAppealRejection = async (event) => {
    event.preventDefault();
    await openIssue(owner, repo, username, repositoryURL, appeal);
  };

  return (
    <div>
        <p>Our automated checks indicate that you are not eligible to join the Maintainers group. If you believe this is wrong, please use the text box below to share more details about your involvement in the project you maintain. A team member will manually review your request and get back to you!</p>
        <form onSubmit={handleSubmitToAppealRejection}>
          <label>Manual Request:
            <textarea type="text" value={appeal} name="appeal"  onChange={(e) => setAppeal(e.target.value)} />
          </label>
          <button type="submit"> Submit </button>
        </form>
     </div>
  );
}
