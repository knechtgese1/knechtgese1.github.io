

type PillToggleProps = {
  options: string[];
  selected: string;
  selectedColor: string;
  handleClick: (value: string) => void;
}

const PillToggle = ({options, selected, selectedColor, handleClick}: PillToggleProps) => {

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
          <label
            htmlFor={`${option.replace(/\s+/g, '').toLowerCase()}-option`}
            style={{
              backgroundColor: selected === option ? selectedColor : 'var(--c-gray)',
            }}
          >{option}</label>
        </>
      )}
    </div>
  );
};

export default PillToggle;