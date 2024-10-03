import "./Dictionary.css";

type DictionaryProps = {
  words: string[];
}

function Dictionary({words}: DictionaryProps) {
  return (
    <>
      <input className="dictionary-search" />
      <ul className="dictionary-list">
        {words.sort().map(word => <li key={word}>{word}</li>)}
      </ul>
    </>
  );
}

export default Dictionary;