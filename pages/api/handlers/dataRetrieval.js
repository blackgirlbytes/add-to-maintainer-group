import { Octokit } from "octokit";
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN_FOR_MEMBER_REPO,
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
const maintainerCommunityRepo = process.env.MAINTAINER_REPO_URL;

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

// get GitHub user handle by email
const getUserHandleByEmail = async (email) => {
  const response = await octokit
    .request("GET /search/users", {
      q: email,
    })
    .catch((error) => {
      console.log(error);
    });
  const userHandle =
    response.status == 200 ? response.data.items[0].login : null;
  return userHandle;
};

// check if user is a Hubber
const isHubber = async (username) => {
  const response = await octokit
    .request("GET /users/{username}", {
      username: username,
    })
    .catch((error) => {
      console.log(error);
    });
  const user = response.status == 200 ? response.data.site_admin : null;
  return user;
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
  getUserRepositories,
  getUserHandleByEmail,
  isHubber,
  maintainerCommunityRepo,
};
