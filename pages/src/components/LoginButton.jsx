import { MarkGithubIcon } from "@primer/octicons-react";
import { Button, Box, StyledOcticon} from "@primer/react";

export default function LoginButton({signIn, session}) {
    const checkElibiiity = async (email) => {
        console.log(email);
    }
    const doBoth = async () => {
        await signIn();
        if (session) {
           console.log('HELLOOOOO');
        }
    }
  return (
    <Box
      mt="4"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <StyledOcticon icon={MarkGithubIcon} size={52} sx={{ mb: 4 }} />
      <Button
        size="large"
        leadingIcon={MarkGithubIcon}
        as="a"
        onClick={signIn}
      >
        Request to join the Maintainer Community
      </Button> 
    </Box>
  );
}
