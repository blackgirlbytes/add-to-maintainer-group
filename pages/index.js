// user fills out form with github username, clicks submit
// user gets added to repository
import { useState } from 'react';
import { Octokit } from "octokit";
import AppealForm from './src/components/AppealForm';

export default function Home() {
  const octokit = new Octokit({
    auth: 'my token',
  });
  const [username, setUsername] = useState("");
  const [repositoryURL, setRepository] = useState("");
  const [showManualForm, setShowManualForm] = useState(null);
  const owner = 'derek-botany'
  const repo = 'test'

 // function for submit button
  const handleSubmitToJoinRepo = async (event) => {
    event.preventDefault();
    const shouldSendInvite = await checkRepositoryRequirements(repositoryURL)
    if (shouldSendInvite) {
      console.log('sending invite')
      await inviteUser(username)
    } else {
      setShowManualForm(true)
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

// repo must be older than 6 months
  const checkRepositoryAge = async (repositoryData) => {
    const repoCreationDate = new Date(repositoryData.created_at);
    const currentDate = new Date();
    const repoAgeRequirement = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
    const isOlderThanSixMonths = repoCreationDate <= repoAgeRequirement;
    return isOlderThanSixMonths;
  }

  // // is user owner of repository?
  const checkRepositoryOwner = async (repoData) => {
    const isOwner = repoData.owner.login == username;
    console.log('they are owner', isOwner)
    return isOwner;
  }

  // is user listed as a member or collaborator of this org?
  // const checkRepositoryCollaborators = async (repoOwner, repoName) => {
  //   const response = await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
  //     owner: repoOwner,
  //     repo: repoName
  //   }).catch(error => {
  //     console.log(error);
  //   });
  //   const isCollaborator = response.status == 200;
  //   console.log('collaborator response', response)
  //   console.log('isCollaborator', isCollaborator)
  //   return isCollaborator;
  // }

  // // function that checks all the above functions
  const checkRepositoryRequirements = async (repositoryURL) => {
    const repoName = await getRepositoryName(repositoryURL);
    const repoOwner = await getRepositoryOwner(repositoryURL);
    const repoData = await getRepoData(repoName, repoOwner);

    const isPopularRepo = await checkRepositoryStars(repoData);
    console.log('isPopularRepo', isPopularRepo)
    const isRepoActive = await checkRepositoryLastCommit(repoData);
    console.log('isRepoActive', isRepoActive)

    const isMaintainer =  await checkRepositoryOwner(repoData);
    // await checkRepositoryCollaborators(repoOwner, repoName) ||
    console.log('isMaintainer', isMaintainer)
    const isOlderThanSixMonths = await checkRepositoryAge(repoData);
    console.log('isOlderThanSixMonths', isOlderThanSixMonths)

    const isEligible = isPopularRepo && isRepoActive && isMaintainer && isOlderThanSixMonths;
    console.log('are they eligible', isEligible)

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
    <div>
      {showManualForm ?
     <AppealForm username={username} repositoryURL={repositoryURL} owner={owner} repo={repo} octokit={octokit} />
    : 
      <form onSubmit={handleSubmitToJoinRepo}>
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
    </form>}
    </div>
  )
}