// user fills out form with github username, clicks submit
// user gets added to repository
import { useState } from "react";
import AppealForm from "./src/components/AppealForm";
import InitialCheck from "./src/components/InitialCheck";
import LoginButton from "./src/components/LoginButton";
import { useSession, signIn, signOut } from "next-auth/react";
import { PageLayout, Box, Text } from "@primer/react";
export default function Home() {
  const [username, setUsername] = useState("");
  const [repositoryURL, setRepository] = useState("");
  const [showManualForm, setShowManualForm] = useState(null);
  const owner = "derek-botany";
  const repo = "test";
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
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
                <Text>
                  Join GitHub’s Maintainer Community! The Maintainer Community
                  is a private space for maintainers to connect with peers,
                  preview GitHub features, and help us support the open source
                  community.
                </Text>
              </Box>

              <LoginButton signIn={signIn} />
            </PageLayout.Content>
            <PageLayout.Footer divider="line" mt="12">
             <Text fontFamily="Mona Sans">Made with ❤️ by GitHub</Text>
            </PageLayout.Footer>
          </PageLayout>
        </>
      ) : (
        //   <AppealForm
        //     username={username}
        //     repositoryURL={repositoryURL}
        //     owner={owner}

        //     repo={repo}
        //   />
        // ) :
        <InitialCheck
          username={username}
          repositoryURL={repositoryURL}
          setUsername={setUsername}
          setRepository={setRepository}
          owner={owner}
          repo={repo}
          setShowManualForm={setShowManualForm}
          email={session.user.email}
        />
      )}
    </div>
  );
}
