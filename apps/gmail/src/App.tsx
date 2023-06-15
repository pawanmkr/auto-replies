import Dashboard from "./pages/dashboard/Dashboard";
import Landing from "./pages/landing/Landing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivacyPolicy from "./pages/privacyPolicy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="" element={<Landing />}></Route>
          <Route path="dashboard" element={<Dashboard />}></Route>
          <Route path="privacy-policy" element={<PrivacyPolicy />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
