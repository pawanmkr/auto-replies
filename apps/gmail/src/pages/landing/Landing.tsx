import Login from "../../components/login/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID =
  "534903018760-b2t9bpjjhoip0hg463mpb8hijip1uq96.apps.googleusercontent.com";

const Landing = () => {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="landing flex justify-center items-center h-[100vh] bg-matte-gray">
        <Login />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Landing;
