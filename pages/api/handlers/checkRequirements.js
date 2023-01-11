import {
  getRepositoryName,
  getRepoData,
  getRepositoryOwner,
  getUserRepositories,
  isHubber,
} from "./dataRetrieval";

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
    return thirdMostStarredRepository;
  } else {
    return null;
  }
};

const checkEligibilityForTopStarredRepository = async (username) => {
  const repositoryURL = await getTopStarredRepository(username);
  const eligibilityTopStarredRepo = await checkRepositoryRequirements(
    username,
    repositoryURL
  );
  return eligibilityTopStarredRepo;
};
const checkEligibilityForSecondTopStarredRepository = async (username) => {
  const repositoryURL = await getSecondTopStarredRepository(username);
  const eligibilitySecondTopStarredRepo = await checkRepositoryRequirements(
    username,
    repositoryURL
  );
  return eligibilitySecondTopStarredRepo;
};

const checkEligibilityForThirdTopStarredRepository = async (username) => {
  const repositoryURL = await getThirdTopStarredRepository(username);
  const eligibilityThirdTopStarredRepo = await checkRepositoryRequirements(
    username,
    repositoryURL
  );
  return eligibilityThirdTopStarredRepo;
};

// function that checks all the above functions
const checkRepositoryRequirements = async (username, repositoryURL) => {
  const repoName = await getRepositoryName(repositoryURL);
  const repoOwner = await getRepositoryOwner(repositoryURL);
  const repoData = await getRepoData(repoName, repoOwner);

  const isPopularRepo = await checkRepositoryStars(repoData);
  const isRepoActive = await checkRepositoryLastCommit(repoData);
  const isMaintainer = await checkRepositoryOwner(repoData, username);
  const isOlderThanSixMonths = await checkRepositoryAge(repoData);

  const nonStaffEligibility =
    isPopularRepo && isRepoActive && isMaintainer && isOlderThanSixMonths;
  const hubberEligibility = isHubber;
  const isEligible = hubberEligibility || nonStaffEligibility;

  return false;
};

// if check eligibility for one of top 3 starred repos is true, then user is eligible
const isUserEligible = async (username) => {
  const getTopStarredRepository = await checkEligibilityForTopStarredRepository(
    username
  );
  const getSecondTopStarredRepository =
    await checkEligibilityForSecondTopStarredRepository(username);
  const getThirdTopStarredRepository =
    await checkEligibilityForThirdTopStarredRepository(username);
  const eligibility =
    getTopStarredRepository ||
    getSecondTopStarredRepository ||
    getThirdTopStarredRepository;
  return eligibility;
};

module.exports = {
  isUserEligible,
};
