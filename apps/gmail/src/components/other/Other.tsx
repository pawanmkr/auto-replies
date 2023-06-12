// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import axios from "axios";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

const socketUrl = "ws://localhost:8888";

const Other = (data) => {
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(data.data.mailCount);
  const [isProcessing, setIsProcessing] = useState(false);
  const totalUnreadMails = data.data.mailCount;
  const { lastMessage } = useWebSocket(socketUrl);

  // Handle received messages
  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.count !== undefined) {
        setCount(messageData.count);
      }
    }
  }, [lastMessage]);

  const startReplying = async () => {
    setIsProcessing(true);

    try {
      let response = await axios({
        method: "post",
        url: "http://localhost:8888/api/v1/mails/reply",
        data: {
          credentials: data.data.tokenResponse,
          messages: data.data.messages,
          replyMsg: data.data.selectedValue,
        },
      });
      response = response.data;
      console.log("Successfully Replied to all your mails.");
      console.log(response);
    } catch (error) {
      console.error("Error when replying: ", error);
    }
    setPending(0);
  };
  return (
    <div className="other text-center">
      <p className="count text-3xl m-4">
        {`${count}/${totalUnreadMails} has been replied!`}
      </p>
      <p className="label text-xl m-4">You have {pending} pending mails.</p>
      <button
        type="button"
        onClick={startReplying}
        className={`btn py-3 px-4 rounded bg-matte-blue hover:bg-matte-blue1 text-gray-200 text-xl font-bold ${
          isProcessing ? "processing" : ""
        }`}
      >
        {isProcessing ? "Processing..." : "Start Auto Reply"}
      </button>
    </div>
  );
};

export default Other;
