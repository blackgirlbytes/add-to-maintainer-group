import { Hero, Button } from "@primer/react-brand";
import React from "react";

export default function LandingPage() {
  return (
    <>
    <Hero
      heading="Join GitHub's Maintainer community"
      description="The Maintainer Community is a private space for maintainers to connect with peers, preview GitHub features, and help us support the open source community."
      primaryAction={{
        text: "Request to join the community",
        href: "#",
      }}
      // secondaryAction={{
      //   text: "Secondary action",
      //   href: "#",
      // }}
      align="center"
    />
  </>
  )

}
