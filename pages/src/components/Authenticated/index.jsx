import { CTABanner, Button } from "@primer/react-brand";
import { Link } from "@primer/react";
import { getUserHandleByEmail, maintainerCommunityRepo } from "../../../api/handlers/dataRetrieval";
import { isUserEligible } from "../../../api/handlers/checkRequirements";
import { inviteUser } from "../../../api/handlers/repoActions";
import React, { useState, useEffect } from "react";
import { ApplicationForm } from "../ApplicationForm";

export default function Authenticated({ email }) {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [eligible, setEligibility] = useState("not checked");
  const owner = "galaxy-bytes";
  const repo = "maintainers";
  const ownerForIssueRepo = "rizel-test-user"
  const issueRepo = "test"
  useEffect(() => {
    const getUsername = async (email) => {
      const handle = await getUserHandleByEmail(email);
      setHandle(handle);
    };
    getUsername(email);
  }, [email]);

  const isEligible = async (e) => {
    e.preventDefault();
    setLoading(true);
    const shouldSendInvite = await isUserEligible(handle);
    if (shouldSendInvite) {
      setEligibility("eligible");
      await inviteUser(handle, owner, repo);
    } else {
      setEligibility("not eligible");
    }
  };
  const sendToMaintainerRepo = async () => {
    setNavigating(true);
    return location.href = "https://github.com/community/maintainers";
  };
  const showSelectedOption = () => {
    switch (eligible) {
      case "not checked":
        return (
          <div>
            <CTABanner hasShadow={false} align="center" hasBackground={false}>
              <CTABanner.Heading>Hi, {handle} &#128075;</CTABanner.Heading>
              <CTABanner.Description>
                To join the maintainers repository, you must be a maintainer of
                an active repository.
                <br />
                <Link href="https://github.com/logout" underline>
                  Not you? Sign out of GitHub and try again
                </Link>
              </CTABanner.Description>
              <CTABanner.ButtonGroup>
                <Button
                  disabled={loading}
                  onClick={(e) => {
                    isEligible(e);
                  }}
                >
                  {loading ? "Loading.." : "Apply to join"}
                </Button>
              </CTABanner.ButtonGroup>
            </CTABanner>
          </div>
        );
      case "eligible":
        return (
          <div>
            <CTABanner hasShadow={false} align="center" hasBackground={false}>
              <CTABanner.Heading>
                You've been invited &#127881;{" "}
              </CTABanner.Heading>
              <CTABanner.Description>
                Check your inbox for an invitation to the community/maintainers
                repository or click the button below! You’ll have 7 days to
                accept the invitation and join the Maintainer Community.
              </CTABanner.Description>
              <CTABanner.ButtonGroup>
                <Button
                  disabled={navigating}
                  onClick={(e) => {
                    sendToMaintainerRepo(e);
                  }}
                >
                  {navigating ? "Navigating..." : "Maintainer Repo"}
                </Button>
              </CTABanner.ButtonGroup>
            </CTABanner>
          </div>
        );
      case "not eligible":
        return (
          <div>
            <ApplicationForm owner={ownerForIssueRepo} repo={issueRepo} username={handle} />{" "}
          </div>
        );
    }
  };
  return <>{showSelectedOption()}</>;
}
