import React from "react";
import { useState } from "react";

export default function AppealForm({octokit, owner, repo, username, repositoryURL}) {
  const [appeal, setAppeal] = useState(null);
  async function openIssue() {
    const result = await octokit
      .request("POST /repos/{owner}/{repo}/issues", {
        owner: owner,
        repo: repo,
        labels: ["pending-invitation"],
        title: `Pending invitation request for: @${username}`,
        body: `@${username} has requested to be added to the repository. Please review their request and add them to the repository if you feel it is appropriate. Here is the link to the repository they maintainer: ${repositoryURL} . Here is their appeal: ${appeal}`,
      })
      .catch((err) => {
        console.log("err", err);
        if (err.status === 403) {
          console.log(`Forbidden ${err.status}`);
        }
        if (err.status === 422) {
          console.log(`Unprocessable Entity ${err.status}`);
        }
      });
    if (result === 201) {
      console.log("opened an issue", result);
    }
  }
  const handleSubmitToAppealRejection = async (event) => {
    event.preventDefault();
    await openIssue();
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
