import {
  FormControl,
  CTABanner,
  TextInput,
  Button,
  Heading,
} from "@primer/react-brand";
import { Box, Textarea } from "@primer/react";
import React, { useState } from "react";
import { openIssue } from "../../../api/handlers/repoActions";
import { signOut } from "next-auth/react";

export const ApplicationForm = ({ owner, repo, username }) => {
  const [repoURL, setRepoURL] = useState("");
  const [repoName, setRepoName] = useState("");
  const [reason, setReason] = useState("");
  const [thankYouMsg, setThankYouMsg] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loggingOut, setLogOut] = useState(false);

  const handleSubmitToAppealRejection = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    await openIssue(owner, repo, username, repoName, repoURL, reason);
    await setThankYouMsg(true);
  };

  const handleRepoURLChange = (event) => {
    setRepoURL(event.target.value);
  };
  const handleRepoNameChange = (event) => {
    setRepoName(event.target.value);
  };
  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    setLogOut(true);
    signOut();
  };
  return (
    <>
      {thankYouMsg ? (
        <div>
          <Box sx={{ position: "relative", overflowX: "scroll" }}></Box>
          <CTABanner hasShadow={false} align="center" hasBackground={false}>
            <CTABanner.Heading>Thank you!</CTABanner.Heading>
            <CTABanner.Description>
              Thanks for your interest in joining GitHub’s Maintainer Community!
              We’ll review your application. If approved, you’ll receive an
              email invitation to join the community/maintainers repository.
            </CTABanner.Description>

            <CTABanner.ButtonGroup>
              <Button
                disabled={loggingOut}
                onClick={(e) => {
                  handleSignOut(e);
                }}
              >
                {loggingOut ? "Signing out..." : "Sign out"}
              </Button>
            </CTABanner.ButtonGroup>
          </CTABanner>{" "}
        </div>
      ) : (
        <>
          <Box sx={{ alignItems: "center", paddingTop: "128px" }}>
            <Heading style={{ textAlign: "center" }}>Tell us more!</Heading>
          </Box>
          <form onSubmit={handleSubmitToAppealRejection}>
            <Box
              sx={{
                alignItems: "center",
                display: "grid",
                gap: 16,
                margin: "30px auto ",
                maxWidth: 600,
                paddingBottom: 3,
              }}
            >
              <FormControl fullWidth required>
                <FormControl.Label>
                  What is the name of the project you maintain?
                </FormControl.Label>
                <TextInput
                  value={repoName}
                  onChange={handleRepoNameChange}
                  required
                />
              </FormControl>

              <FormControl fullWidth required>
                <FormControl.Label>
                  What is repository URL to the project you maintain?
                </FormControl.Label>
                <TextInput
                  value={repoURL}
                  onChange={handleRepoURLChange}
                  leadingText="github.com/"
                  required
                />
              </FormControl>
              <FormControl fullWidth required>
                <FormControl.Label>
                  Why do you want to join the Maintainers community?
                </FormControl.Label>
                <Textarea value={reason} onChange={handleReasonChange} />
              </FormControl>
              <Box
                sx={{
                  justifyContent: "end",
                  display: "inline-grid",
                  gap: 16,
                }}
              >
                <Button variant="primary" type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Box>
          </form>
        </>
      )}
    </>
  );
};

export default ApplicationForm;
