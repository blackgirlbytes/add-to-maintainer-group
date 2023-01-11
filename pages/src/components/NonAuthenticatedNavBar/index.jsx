import { SubdomainNavBar } from "@primer/react-brand";
import { Box } from "@primer/react";
import React from "react";

export default function NonAuthenticatedNavBar({}) {
  return (
    <Box sx={{ position: "relative", overflowX: "scroll" }}>
      <SubdomainNavBar title="Maintainers Community" fixed={false} />
    </Box>
  );
}
