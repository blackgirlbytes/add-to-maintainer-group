import { SubdomainNavBar } from "@primer/react-brand";
import { Box } from "@primer/react";
import React from "react";
import { signOut } from "next-auth/react";
export default function AuthenticatedNavBar({}) {
  return (
    <Box sx={{ position: "relative", overflowX: "scroll" }}>
      <SubdomainNavBar title="Maintainers Community" fixed={false}>
        <SubdomainNavBar.SecondaryAction
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
          href={`/api/auth/signout`}
        >
          Sign out
        </SubdomainNavBar.SecondaryAction>
      </SubdomainNavBar>
    </Box>
  );
}
