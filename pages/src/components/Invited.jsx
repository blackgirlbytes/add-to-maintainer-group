import { CheckIcon } from "@primer/octicons-react";
import { Box, PageLayout, Text} from "@primer/react";

export default function Invited({handle}) {
// github emoji to return envelope emoji
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
          <Text>
          Congratulations, {handle}! Check your inbox for an invitation to the <Text fontColor="">community/maintainers</Text> repository! You’ll have 7 days to accept the invitation and join the Maintainer Community.
          </Text>
        </Box>
      </PageLayout.Content>
      <PageLayout.Footer divider="line" mt="12">
       <Text fontFamily="Mona Sans">Made with ❤️ by GitHub</Text>
      </PageLayout.Footer>
    </PageLayout>
    </>
  );
}
