import "./App.css";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Header from "./Header";
import MusicMatch from "./MusicMatch";

// API to extract the code query parameter from the current URL
const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return (
    <div>
      <Header />
      {/* Ternary operator to determine which components to render before user is logged in */}
      {code ? (
        <>
          <MusicMatch />
          <Dashboard code={code} />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
