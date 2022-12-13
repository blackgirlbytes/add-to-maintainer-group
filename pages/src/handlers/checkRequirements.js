import { getRepositoryName, getRepoData, getRepositoryOwner, getUserRepositories} from "./dataRetrieval";

// check that repository is popular
const checkRepositoryStars = async (repositoryData) => {
  const popularRepoCount = 7;
  const isPopularRepo = repositoryData.stargazers_count >= popularRepoCount;
  return isPopularRepo;
};
// check if repo's last commit was within the last 90 days
const checkRepositoryLastCommit = async (repositoryData) => {
  const lastCommitDate = new Date(repositoryData.pushed_at);
  const currentDate = new Date();
  const lastCommitRequirement = new Date(
    currentDate.setDate(currentDate.getDate() - 90)
  );
  const isRecentCommit = lastCommitDate >= lastCommitRequirement;
  return isRecentCommit;
};

// repo must be older than 6 months
const checkRepositoryAge = async (repositoryData) => {
  const repoCreationDate = new Date(repositoryData.created_at);
  const currentDate = new Date();
  const repoAgeRequirement = new Date(
    currentDate.setMonth(currentDate.getMonth() - 6)
  );
  const isOlderThanSixMonths = repoCreationDate <= repoAgeRequirement;
  return isOlderThanSixMonths;
};

// is user owner of repository?
const checkRepositoryOwner = async (repoData, username) => {
  const isOwner = repoData.owner.login == username;
  console.log("they are owner", isOwner);
  return isOwner;
};

// return top starred repositories

const getTopStarredRepository = async (username) => {
  const userRepositories = await getUserRepositories(username);
  if (userRepositories) {
    const sortedRepositories = userRepositories.sort((a, b) => {
      return b.stargazers_count - a.stargazers_count;
    });
    const mostStarredRepository = sortedRepositories[0].html_url;
    console.log(mostStarredRepository)
    return mostStarredRepository;
  } else {
    return null;
  }
  
};

// return second top starred repositories
const getSecondTopStarredRepository = async (username) => {
  const userRepositories = await getUserRepositories(username);
  if (userRepositories) {
    const sortedRepositories = userRepositories.sort((a, b) => {
      return b.stargazers_count - a.stargazers_count;
    });
    const secondMostStarredRepository = sortedRepositories[1].html_url;
    console.log(secondMostStarredRepository)
    return secondMostStarredRepository;
  } else {
    return null;
  }
};

// return third top starred repositories
const getThirdTopStarredRepository = async (username) => {
  const userRepositories = await getUserRepositories(username);
  if (userRepositories) {
    const sortedRepositories = userRepositories.sort((a, b) => {
      return b.stargazers_count - a.stargazers_count;
    });
    const thirdMostStarredRepository = sortedRepositories[2].html_url;
    console.log(thirdMostStarredRepository)
    return thirdMostStarredRepository;
  } else {
    return null;
  }
};

const checkEligibilityForTopStarredRepository = async (username) => {
  const repositoryURL = await getTopStarredRepository(username);
  const eligibilityTopStarredRepo = await checkRepositoryRequirements(username, repositoryURL);
  console.log('first')
  return eligibilityTopStarredRepo;
};
const checkEligibilityForSecondTopStarredRepository = async (username) => {
  const repositoryURL = await getSecondTopStarredRepository(username);
  const eligibilitySecondTopStarredRepo = await checkRepositoryRequirements(username, repositoryURL);
  console.log('second')
  return eligibilitySecondTopStarredRepo;
};

const checkEligibilityForThirdTopStarredRepository = async (username) => {
  const repositoryURL = await getThirdTopStarredRepository(username);
  const eligibilityThirdTopStarredRepo = await checkRepositoryRequirements(username, repositoryURL);
  console.log('third')
  return eligibilityThirdTopStarredRepo;
};


// function that checks all the above functions
const checkRepositoryRequirements = async (username, repositoryURL) => {
  const repoName = await getRepositoryName(repositoryURL);
  const repoOwner = await getRepositoryOwner(repositoryURL);
  const repoData = await getRepoData(repoName, repoOwner);

  const isPopularRepo = await checkRepositoryStars(repoData);
  console.log("isPopularRepo", isPopularRepo);
  const isRepoActive = await checkRepositoryLastCommit(repoData);
  console.log("isRepoActive", isRepoActive);

  const isMaintainer = await checkRepositoryOwner(repoData, username);
  // await checkRepositoryCollaborators(repoOwner, repoName) ||
  console.log("isMaintainer", isMaintainer);
  const isOlderThanSixMonths = await checkRepositoryAge(repoData);
  console.log("isOlderThanSixMonths", isOlderThanSixMonths);

  const isEligible =
    isPopularRepo && isRepoActive && isMaintainer && isOlderThanSixMonths;
  console.log("are they eligible", isEligible);

  return isEligible;
};

// if check eligibility for one of top 3 starred repos is true, then user is eligible
const isUserEligible = async (username) => {
  const getTopStarredRepository = await checkEligibilityForTopStarredRepository(username);
  const getSecondTopStarredRepository = await checkEligibilityForSecondTopStarredRepository(username);
  const getThirdTopStarredRepository = await checkEligibilityForThirdTopStarredRepository(username);
  const eligibility = getTopStarredRepository || getSecondTopStarredRepository || getThirdTopStarredRepository;
  console.log('eligibility', eligibility)
  return eligibility;
};
// figure out if they're an admin instead
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

module.exports = {
  isUserEligible
};
