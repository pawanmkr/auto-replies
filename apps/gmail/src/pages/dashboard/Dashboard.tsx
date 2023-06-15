import Stats from "../../components/Stats/Stats";
import Sidebar from "../../components/Sidebar/Sidebar";
import Other from "../../components/other/Other";
import { useLocation } from "react-router-dom";
import ReplyMessage from "../../components/ReplyMessage";
import { useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const location = useLocation();
  const { count, total, messages } = location.state.unread.data;
  const tokenResponse = location.state.tokenResponse;
  const profile = {
    dp: location.state.user.picture,
    fullName: `${location.state.user.given_name} ${location.state.user.family_name}`,
    email: location.state.user.email,
  };

  const [options, setOptions] = useState([
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
  ]);
  const [selectedValue, setSelectedValue] = useState(options[0].value);
  const [optionLabel, setOptionLabel] = useState("");
  const [optionValue, setOptionValue] = useState("");
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };

  async function saveOptionOnServer(option: object) {
    // todo: send access_token in headers, sending in body is not a good practice
    await axios
      .post(`${import.meta.env.VITE_SERVER}/api/v1/reply/option`, {
        option,
        access_token: tokenResponse.access_token,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(
          `Error occurred while saving option on server: ${err.message}`
        );
      });
  }

  const saveOption = async () => {
    // edge case not handled yet: keep the label unique it is used as key
    const option = {
      label: optionLabel,
      value: optionValue,
    };
    await saveOptionOnServer(option);
    setOptions([...options, option]);
  };
  const [totalReplied, setTotalReplied] = useState(total);

  const data = {
    messages,
    tokenResponse,
    selectedValue,
  };

  return (
    <div className="dashboard-container flex bg-gray-200">
      <Sidebar profile={profile} />
      <div className="content mt-8 flex flex-col items-center w-full h-[50vh] justify-between">
        <Stats mailCount={count} totalReplied={totalReplied} />
        <ReplyMessage
          options={options}
          handleOptionChange={handleOptionChange}
          value={selectedValue}
          saveOption={saveOption}
          setOptionLabel={setOptionLabel}
          setOptionValue={setOptionValue}
        />
        <Other data={data} setTotalReplied={setTotalReplied} />
      </div>
    </div>
  );
};

export default Dashboard;
