import { useEffect, useState } from "react";
import "./Dictionary.css";

type DictionaryProps = {
  words: string[];
}

function Dictionary({words}: DictionaryProps) {
  const [searchValue, setSearchValue] = useState('');
  const [sortedWords, setSortedWords] = useState(words);
  const handleInput = (e: InputEvent) => {
    //TODO: type this properly
    setSearchValue(e.target!.value);
  }

useEffect(() => {
  setSortedWords(words.sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())).filter(word => word.includes(searchValue)));
}, [words, searchValue]);

  return (
    <div className="dictionary-wrapper">
      <label htmlFor="dictionary-search">Search</label>
      <input id="dictionary-search" className="dictionary-search" onInput={handleInput} />
      <ul className="dictionary-list">
        {sortedWords.map(word => <li key={word}>{word}</li>)}
      </ul>
    </div>
  );
}

export default Dictionary;