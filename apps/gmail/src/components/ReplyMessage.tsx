interface ReplyProps {
  options: { label: string; value: string }[];
  handleOptionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

const ReplyMessage = ({ options, handleOptionChange, value }: ReplyProps) => {
  return (
    <div className="reply-container">
      <label>
        Select the Reply Message
        <select value={value} onChange={handleOptionChange}>
          {options.map((option) => (
            <option value={option.value} key={Math.random()}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default ReplyMessage;
