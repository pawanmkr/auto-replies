// @ts-ignore
import { useState } from "react";

const Stats = (mails) => {
  const [repliedMails, setRepliedMails] = useState(0);

  return (
    <div className="stats rounded bg-gray-300 h-max p-4 text-center flex">
      <div className="unread-mails p-3 rounded m-3 bg-gray-200 w-44">
        <p className="label text-l">Unread mails</p>
        <p className="count text-6xl font-bold my-4">{mails.count}</p>
      </div>
      <div className="replied-mails p-3 rounded bg-gray-200 m-3 w-44">
        <p className="label text-l">Replied mails</p>
        <p className="count text-6xl font-bold my-4">{repliedMails}</p>
      </div>
      <div className="replied-mails p-3 rounded bg-gray-200 m-3 w-44">
        <p className="label text-l">Total replied mails</p>
        <p className="count text-6xl font-bold my-4">489</p>
      </div>
    </div>
  );
};

export default Stats;
