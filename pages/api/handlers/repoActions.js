import { Octokit } from "octokit";


const octokitMemberRepo = new Octokit({
  auth: process.env.GITHUB_TOKEN_FOR_MEMBER_REPO,
});
const octokitIssueRepo = new Octokit({
  auth: process.env.GITHUB_TOKEN_FOR_ISSUES_REPO,
});
// // function to invite user to target repo
const inviteUser = async (username, owner, repo) => {
  await octokitMemberRepo
    .request(`PUT /repos/{owner}/{repo}/collaborators/${username}`, {
      permission: "read",
      owner: 'galaxy-bytes',
      repo: 'maintainers',
    })
    .catch((error) => {
      console.log(error);
    });
};

const openIssue = async (owner, repo, username, repoName, repoURL, reason) => {
  const body = `## Who is requesting to join the repo? \n @${username} \n ## What project do they maintain? \n ${repoName} \n ## What is the repository URL for the project? \n https://github.com/${repoURL} \n ## Why do they want to join? \n ${reason}`;
  const result = await octokitIssueRepo
    .request("POST /repos/{owner}/{repo}/issues", {
      owner: owner,
      repo: repo,
      labels: ["pending-invitation"],
      title: `Pending invitation request for: @${username}`,
      body: body,
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
};

module.exports = {
  inviteUser,
  openIssue,
};
