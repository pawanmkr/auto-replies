import googleIcon from "../../assets/icons/google-48.svg";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      let response, user, loginToken;
      try {
        // get count of unread mails
        response = await axios({
          method: "post",
          url: "http://localhost:8888/api/v1/mails/count",
          data: {
            credentials: tokenResponse,
          },
        });
        response = response.data;
      } catch (error) {
        console.error("Error logging @google: ", error);
      }
      // request for profile details from google account
      try {
        user = await axios({
          method: "get",
          url: "https://www.googleapis.com/oauth2/v1/userinfo",
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            Accept: "application/json",
          },
        });
        user = user.data;
      } catch (error) {
        console.error("error getting profile");
      }
      try {
        // automail server login request
        loginToken = await axios({
          method: "post",
          url: "http://localhost:8888/api/v1/user/login",
          data: {
            access_token: tokenResponse.access_token,
            first_name: user.given_name,
            last_name: user.family_name,
            email: user.email,
          },
        });
        loginToken = loginToken.data;
      } catch (error) {
        console.error("Error logging in server: ", error);
      }
      // navigating to dashboard page with needed data
      navigate("/dashboard", { state: { response, tokenResponse, user } });
    },
  });

  return (
    <div className="btn-container font-source-sans-3 bg-gray-300 rounded p-3 hover:bg-black hover:text-gray-300">
      <button
        type="button"
        className="flex justify-center items-center text-4xl"
        onClick={() => login()}
      >
        <span className="mr-2">
          <img
            className="w-[48px] h-[48px]"
            src={googleIcon}
            alt="Google Icon"
          />
        </span>
        Signin with Google
      </button>
    </div>
  );
};

export default Login;
