import "../styles/globals.css";
import { BaseStyles, ThemeProvider, SSRProvider } from "@primer/react";
import { SessionProvider } from "next-auth/react"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <ThemeProvider preventSSRMismatch>
      <SSRProvider>
        <BaseStyles>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </BaseStyles>
      </SSRProvider>
    </ThemeProvider>
  );
}

export default MyApp;
