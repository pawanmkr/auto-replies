// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

const socketUrl = import.meta.env.VITE_WS_SERVER;

interface StartProps {
  mailCount: number;
  totalReplied: number;
}

const Stats = ({ mailCount, totalReplied }: StartProps) => {
  const [count, setCount] = useState(mailCount);
  const { lastMessage } = useWebSocket(socketUrl);
  const [repliedMails, setRepliedMails] = useState(0);

  useEffect(() => {
    if (lastMessage !== null) {
      const messageData = JSON.parse(lastMessage.data);
      if (messageData.count !== undefined) {
        setCount((count) => count - 1);
        setRepliedMails(messageData.count);
      }
    }
  }, [lastMessage]);

  return (
    <div className="stats rounded bg-gray-300 h-max p-4 text-center flex">
      <div className="unread-mails p-3 rounded m-3 bg-gray-200 w-44">
        <p className="label text-l">Unread mails</p>
        <p className="count text-6xl font-bold my-4">{count}</p>
      </div>
      <div className="replied-mails p-3 rounded bg-gray-200 m-3 w-44">
        <p className="label text-l">Replied mails</p>
        <p className="count text-6xl font-bold my-4">{repliedMails}</p>
      </div>
      <div className="replied-mails p-3 rounded bg-gray-200 m-3 w-44">
        <p className="label text-l">Total replied mails</p>
        <p className="count text-6xl font-bold my-4">{totalReplied}</p>
      </div>
    </div>
  );
};

export default Stats;
