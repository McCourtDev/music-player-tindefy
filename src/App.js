import "./App.css";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Header from "./Header";
import { useState } from "react";

import TopTracks from "./TopTracks";

// API to extract the code query parameter from the current URL
const code = new URLSearchParams(window.location.search).get("code");

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <div>
      <Header />
      {/* Ternary operator to determine which components to render before user is logged in */}
      {code ? (
        <>
          <Dashboard
            code={code}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
        </>
      ) : (
        <>
          <Login />
        </>
      )}
    </div>
  );
}

export default App;
