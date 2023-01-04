import React from "react";
import { useState } from "react";
import { openIssue } from "../handlers/repoActions";
import MinimalExample from "./MarkdownEditor";
import { Box, PageLayout, Text} from "@primer/react";


export default function AppealForm({owner, repo, username, repositoryURL}) {
  const [appeal, setAppeal] = useState(null);

  const handleSubmitToAppealRejection = async (event) => {
    // event.preventDefault();
    console.log('CLICKED')
    // await openIssue(owner, repo, username, repositoryURL, appeal);
  };

  return (
    <>
    <PageLayout>
      <PageLayout.Header divider="line">
        <Text fontFamily="Mona Sans" fontSize="6" fontWeight="bold">
          GitHub's Maintainer Community
        </Text>
      </PageLayout.Header>
      <PageLayout.Content
        padding="normal"
        mt="5"
        mb="9"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          mt="4"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          fontFamily="Mona Sans"
          fontSize="4"
          textAlign="center"
        >
         <p>Hi, {username}! Tell us a bit more about yourself and why you’d like to join the private Maintainer Community.</p>
        <MinimalExample handleSubmit={handleSubmitToAppealRejection}/>
        </Box>
      </PageLayout.Content>
      <PageLayout.Footer divider="line" mt="12">
       <Text fontFamily="Mona Sans">Made with ❤️ by GitHub</Text>
      </PageLayout.Footer>
    </PageLayout>
    </>

  );
}
