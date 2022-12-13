import { Octokit } from "octokit";
const octokit = new Octokit({
  auth: "add token here",
});
// // function to invite user to target repo
const inviteUser = async (username, owner, repo) => {
    const response = await octokit
      .request(`PUT /repos/{owner}/{repo}/collaborators/${username}`, {
        permission: "push",
        owner: owner,
        repo: repo,
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(`Invited ${username} to ${repo}`);
  };

  const openIssue = async (owner, repo, username, repositoryURL, appeal) => {
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


  module.exports = {
   inviteUser,
   openIssue,
  };
    