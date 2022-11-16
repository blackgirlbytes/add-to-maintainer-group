// user fills out form with github username, clicks submit
// user gets added to repository
import { useState } from 'react';
import { Octokit } from "octokit";

export default function Home() {
  const octokit = new Octokit({
    auth: 'my token',
  });
  const [username, setUsername] = useState("");
  const [repositoryURL, setRepository] = useState("");
  const [appeal, setAppeal] = useState(null);
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
  const handleSubmitToAppealRejection = async (event) => {
    event.preventDefault();
    await openIssue()
}

async function openIssue() {
  const result = await octokit.request('POST /repos/{owner}/{repo}/issues', {
    owner: owner,
    repo: repo,
    labels: ['pending-invitation'],
    title: `Pending invitation request for: @${username}`,
    body: `@${username} has requested to be added to the repository. Please review their request and add them to the repository if you feel it is appropriate. Here is the link to the repository they maintainer: ${repositoryURL} . Here is their appeal: ${appeal}`,
  }).catch(err => {
    console.log('err', err)
    if (err.status === 403) {
      console.log(`Forbidden ${err.status}`)
    }
    if (err.status === 422) {
      console.log(`Unprocessable Entity ${err.status}`);
    }
  }
  );
  if (result === 201) {
    console.log("opened an issue", result);
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
    const isEligible = isPopularRepo && isRepoActive && isMaintainer;
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
      <div>
        <p>Our automated checks indicate that you are not eligible to join the Maintainers group. If you believe this is wrong, please use the text box below to share more details about your involvement in the project you maintain. A team member will manually review your request and get back to you!</p>
        <form onSubmit={handleSubmitToAppealRejection}>
          <label>Manual Request:
            <textarea type="text" value={appeal} name="appeal"  onChange={(e) => setAppeal(e.target.value)} />
          </label>
          <button type="submit"> Submit </button>
        </form>
     </div>
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
