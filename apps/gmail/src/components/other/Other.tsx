// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import axios from "axios";
import { useState } from "react";

const Other = ({ data, setTotalReplied }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const startReplying = async () => {
    setIsProcessing(true);
    try {
      const response = await axios({
        method: "post",
        url: `${import.meta.env.VITE_SERVER}/api/v1/mails/reply`,
        data: {
          credentials: data.tokenResponse,
          messages: data.messages,
          replyMsg: data.selectedValue,
        },
      });
      console.log(response.data.message);
      setTotalReplied(response.data.totalReplied);
    } catch (error) {
      console.error("Error when replying: ", error);
    }
    setIsProcessing(false);
  };
  return (
    <button
      type="button"
      onClick={startReplying}
      className={`btn py-3 px-4 rounded text-xl font-bold text-center
      text-gray-200 bg-matte-blue hover:bg-matte-blue1 
        ${isProcessing ? "processing" : ""}
      `}
    >
      {isProcessing ? "Processing..." : "Start Auto Reply"}
    </button>
  );
};

export default Other;
