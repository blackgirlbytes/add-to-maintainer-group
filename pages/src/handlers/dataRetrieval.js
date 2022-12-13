import { Octokit } from "octokit";
const octokit = new Octokit({
  auth: "add token here",
});
// grab the repository name from url that requestor submitted
const getRepositoryName = (repositoryURL) => {
  const splitURL = repositoryURL.split("/");
  return splitURL[splitURL.length - 1];
};

// get repository owner from URL that requestor submitted
const getRepositoryOwner = (repositoryURL) => {
  const splitURL = repositoryURL.split("/");
  return splitURL[splitURL.length - 2];
};
// grab data about the repo that requestor submitted
const getRepoData = async (repoName, repoOwner) => {
  const response = await octokit
    .request("GET /repos/{owner}/{repo}", {
      owner: repoOwner,
      repo: repoName,
    })
    .catch((error) => {
      console.log(error);
    });

  const repositoryData = response.status == 200 ? response.data : null;
  return repositoryData;
};

  // get all repositories owned by user
  const getUserRepositories = async (username) => {
    const response = await octokit
      .request("GET /users/{username}/repos", {
        username: username,
      })
      .catch((error) => {
        console.log(error);
      });
    const userRepositories = response.status == 200 ? response.data : null;
    return userRepositories;
  };

module.exports = {
  getRepositoryName,
  getRepositoryOwner,
  getRepoData,
  getUserRepositories
};
