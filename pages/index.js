// user fills out form with github username, clicks submit
// user gets added to repository
import { useState } from 'react';
import { Octokit } from "octokit";

export default function Home() {
  const octokit = new Octokit({
    auth: 'MY TOKEN',
    test
  });
  const [username, setUsername] = useState("");
  const [repositoryURL, setRepository] = useState("");
  const owner = 'derek-botany'
  const repo = 'publish-to-docker'

 // function for submit button
  const handleSubmit = async (event) => {
    event.preventDefault();
    const shouldSendInvite = await checkRepositoryRequirements(repositoryURL)
    if (shouldSendInvite) {
      await inviteUser(username)
    }
  }
  // grab the repository name from url that requestor submitted
  const getRepositoryName = (repositoryURL) => {
    const splitURL = repositoryURL.split('/')
    return splitURL[splitURL.length - 1]
  }

  // get repository owner from URL that requestor submitted
  const getRepositoryOwner = (repositoryURL) => {
    const splitURL = repositoryURL.split('/')
    return splitURL[splitURL.length - 2]
  }
  // grab data about the repo that requestor submitted
  const getRepoData = async (repoName, repoOwner) => {
    const response = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: repoOwner,
      repo: repoName
    }).catch(error => {
      console.log(error);
    });

    const repositoryData = response.status == 200 ? response.data : null;
    return repositoryData;
  }
  // check that repository is popular
  const checkRepositoryStars = async (repositoryData) => {
    const popularRepoCount = 7
    const isPopularRepo = repositoryData.stargazers_count >= popularRepoCount;
    return isPopularRepo;
  }

  // check if repo's last commit was within the last 90 days
  const checkRepositoryLastCommit = async (repositoryData) => {
    const lastCommitDate = new Date(repositoryData.pushed_at);
    const currentDate = new Date();
    const lastCommitRequirement = new Date(currentDate.setDate(currentDate.getDate() - 90));
    const isRecentCommit = lastCommitDate >= lastCommitRequirement;
    return isRecentCommit;
  }

  // // is user owner of repository?
  const checkRepositoryOwner = async () => {
    const isOwner = repositoryData.owner.login == username;
    console.log(isOwner)
    return isOwner;
  }

  // is user listed as a member or collaborator of this org?
  const checkRepositoryCollaborators = async (repoOwner, repoName) => {
    const response = await octokit.request('GET /orgs/{org}/members/{username}', {
      org: repoOwner,
      username: username
    }).catch(error => {
      console.log(error);
    });
    const isCollaborator = response.status == 204;
    return isCollaborator;
  }

  // // function that checks all the above functions
  const checkRepositoryRequirements = async (repositoryURL) => {
    const repoName = await getRepositoryName(repositoryURL);
    const repoOwner = await getRepositoryOwner(repositoryURL);
    const repoData = await getRepoData(repoName, repoOwner);

    const isPopularRepo = await checkRepositoryStars(repoData);
    const isRepoActive = await checkRepositoryLastCommit(repoData);

    const isMaintainer = await checkRepositoryCollaborators(repoOwner, repoName) || await checkRepositoryOwner();
    const isEligible = isPopularRepo && isRepoActive && isMaintainer;

    return isEligible;
  }

  // // function to invite user to target repo
  const inviteUser = async (username) => {
    const response = await octokit.request(`PUT /repos/{owner}/{repo}/collaborators/${username}`, {
      permission: 'push',
      owner: owner,
      repo: repo,
    }).catch(error => {
      console.log(error);
    });
    console.log(`Invited ${username} to ${repo}`)
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>GitHub Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>GitHub Repository URL:
        <input
          type="text"
          value={repositoryURL}
          onChange={(e) => setRepository(e.target.value)}
        />
      </label>
      <button type="submit"> Submit </button>
    </form>
  )
}
