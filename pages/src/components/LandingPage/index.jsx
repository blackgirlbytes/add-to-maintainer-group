import React from "react";
import Authenticated from "../Authenticated";
import Login from "../Login";
import AuthenticatedNavBar from "../AuthenticatedNavBar";
import NonAuthenticatedNavBar from "../NonAuthenticatedNavBar";

export default function LandingPage({ signIn, provider, session }) {
  return (
    <>
      {!session ? (
        <>
          <NonAuthenticatedNavBar />
          <Login session={session} signIn={signIn} provider={provider} />
        </>
      ) : (
        <>
          <AuthenticatedNavBar />
          <Authenticated email={session.user.email} />
        </>
      )}
    </>
  );
}
