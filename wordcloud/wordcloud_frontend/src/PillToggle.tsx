

type PillToggleProps = {
  options: string[];
  selected: string;
  handleClick: (value: string) => void;
}

const PillToggle = ({options, selected, handleClick}: PillToggleProps) => {

  return (
    <div role="group" aria-label="Word Cloud or Dictionary" className="pill-toggle">
      {options.map(option =>
        <>
          <input
            type="radio"
            id={`${option.replace(/\s+/g, '').toLowerCase()}-option`}
            name="viewOption"
            value={option}
            checked={selected === option}
            onChange={() => handleClick(option)}
          />
          <label htmlFor={`${option.replace(/\s+/g, '').toLowerCase()}-option`}>{option}</label>
        </>
      )}
    </div>
  );
};

export default PillToggle;