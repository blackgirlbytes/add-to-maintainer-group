// user fills out form with github username, clicks submit
// user gets added to repository
import { useState } from "react";
import AppealForm from "./src/components/AppealForm";
import InitialForm from "./src/components/InitialForm";

export default function Home() {
  const [username, setUsername] = useState("");
  const [repositoryURL, setRepository] = useState("");
  const [showManualForm, setShowManualForm] = useState(null);
  const owner = "derek-botany";
  const repo = "test";

  return (
    <div>
      {showManualForm ? (
        <AppealForm
          username={username}
          repositoryURL={repositoryURL}
          owner={owner}
          repo={repo}
        />
      ) : (
        <InitialForm
          username={username}
          repositoryURL={repositoryURL}
          setUsername={setUsername}
          setRepository={setRepository}
          owner={owner}
          repo={repo}
          setShowManualForm={setShowManualForm}
        />
      )}
    </div>
  );
}
