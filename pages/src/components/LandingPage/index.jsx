import { Hero, SubdomainNavBar } from "@primer/react-brand";
import { Box } from "@primer/react";
import React from "react";

export default function LandingPage() {
  return (
    <>
      <Box sx={{ position: "relative", overflowX: "scroll" }}>
        <SubdomainNavBar
          title="Maintainers Community"
          fixed={false}
        ></SubdomainNavBar>
      </Box>
      <Hero
        heading="Join GitHub's Maintainer Community"
        description="The Maintainer Community is a private space for maintainers to connect with peers, preview GitHub features, and help us support the open source community."
        primaryAction={{
          text: "Request to join the community",
          href: "#",
        }}
        className="hero-location"
        // secondaryAction={{
        //   text: "Secondary action",
        //   href: "#",
        // }}
        align="center"
      />
    </>
  );
}
