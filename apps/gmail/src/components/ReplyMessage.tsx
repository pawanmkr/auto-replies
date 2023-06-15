import React, { ChangeEvent, MouseEventHandler } from "react";

interface ReplyProps {
  options: { label: string; value: string }[];
  handleOptionChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  saveOption: MouseEventHandler<HTMLButtonElement>;
  setOptionLabel: React.Dispatch<React.SetStateAction<string>>;
  setOptionValue: React.Dispatch<React.SetStateAction<string>>;
}

const ReplyMessage = ({
  options,
  handleOptionChange,
  value,
  saveOption,
  setOptionLabel,
  setOptionValue,
}: ReplyProps) => {
  return (
    <div className="reply-container my-8">
      <div className="custom-option flex flex-col bg-gray-300 p-4 rounded">
        <textarea
          className="mb-4 p-2 border-none rounded"
          cols={67}
          rows={5}
          placeholder="Please enter the detailed message here..."
          onChange={(event) => setOptionValue(event?.target.value)}
        ></textarea>
        <div>
          <input
            type="text"
            placeholder="Short reference name, like Vacation or Busy"
            onChange={(event) => setOptionLabel(event?.target.value)}
            className="w-[76%] p-2 border-none rounded"
          />
          <button
            type="button"
            onClick={saveOption}
            className="bg-matte-blue w-max text-gray-200 p-2 px-12 rounded float-right hover:bg-matte-blue1"
          >
            Save
          </button>
        </div>
      </div>
      <div className="option-selector mt-4 text-center">
        <label>
          <select
            value={value}
            onChange={handleOptionChange}
            className="w-[200px] p-2 rounded"
          >
            {options.map((option) => (
              <option value={option.value} key={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default ReplyMessage;
