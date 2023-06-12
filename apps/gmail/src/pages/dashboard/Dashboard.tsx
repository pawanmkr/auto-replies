import Stats from "../../components/Stats/Stats";
import Sidebar from "../../components/Sidebar/Sidebar";
// import dp from "../../assets/icons/google-48.svg";
import Other from "../../components/other/Other";
import { useLocation } from "react-router-dom";
import ReplyMessage from "../../components/ReplyMessage";
import { useState } from "react";

const Dashboard = () => {
  const location = useLocation();
  let mailCount = 0,
    messages = [];
  const response = location.state.response.data;

  if (response !== null) {
    mailCount = response.count;
    messages = response.messages;
  }
  const tokenResponse = location.state.tokenResponse;
  const profile = {
    dp: location.state.user.picture,
    fullName: `${location.state.user.given_name} ${location.state.user.family_name}`,
    email: location.state.user.email,
  };

  const options = [
    {
      label: "Vacation",
      value: "I am on vacation, will reply after 30th June",
    },
    { label: "Busy", value: "I am very busy right now" },
    {
      label: "Weekend",
      value:
        "i am enjoying my weekend will see your application in office hours",
    },
  ];
  const [selectedValue, setSelectedValue] = useState(options[0].value);
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };

  const data = {
    mailCount,
    messages,
    tokenResponse,
    selectedValue,
  };

  return (
    <div className="dashboard-container flex bg-gray-200">
      <Sidebar profile={profile} />
      <div className="content mt-8 flex flex-col items-center w-full h-[50vh] justify-between">
        <Stats count={mailCount} />
        <ReplyMessage
          options={options}
          handleOptionChange={handleOptionChange}
          value={selectedValue}
        />
        <Other data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
