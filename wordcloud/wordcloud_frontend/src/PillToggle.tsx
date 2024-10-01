type Display = 'wordcloud' | 'dictionary';

type PillToggleProps = {
  handleClick: (value: Display) => void;
  selected: Display;
}

const PillToggle = ({selected, handleClick}: PillToggleProps) => {

  return (
    <div role="group" aria-label="Word Cloud or Dictionary" className="pill-toggle">
      <input
        type="radio"
        id="wordcloud-option"
        name="viewOption"
        value="wordcloud"
        checked={selected === 'wordcloud'}
        onChange={() => handleClick('wordcloud')}
      />
      <label htmlFor="wordcloud-option">Word Cloud</label>

      <input
        type="radio"
        id="dictionary-option"
        name="viewOption"
        value="dictionary"
        checked={selected === 'dictionary'}
        onChange={() => handleClick('dictionary')}
      />
      <label htmlFor="dictionary-option">Dictionary</label>
    </div>
  );
};

export default PillToggle;