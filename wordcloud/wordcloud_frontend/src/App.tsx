import './App.css'
import { useState } from 'react';
import Matrix from './Matrix';
import WordCloud from './Wordcloud';
import PillToggle from './PillToggle';
import Dictionary from './Dictionary';

function App() {

  //TODO: move these to state and database fetches
  const fakeWords = [
    {
      text: 'Sample',
      value: 500,
    },
    {
      text: 'Word',
      value: 300,
    },
    {
      text: 'Cloud',
      value: 250,
    },
    {
      text: 'transmogrification',
      value: 500,
    }
  ];

  const addedWords = ['glomerulonephritis', 'anuric', 'hyperphosphatemia', 'hyponatremia'];

  const [display, setDisplay] = useState('Word Cloud');
  const [words, setWords] = useState(fakeWords);
  const [wordCloudInputError, setWordCloudInputError] = useState('');

  const handleDisplayChange = (value: string) => {
    console.log('change to', value);
    setDisplay(value);
  }

  const handleWordCloudClick = (text: string) => {
    console.log('clicked', text);
  }

  const handleWordCloudInput = () => {
    setWordCloudInputError('');
  }

  const handleWordCloudSubmit = (e: React.FormEvent<HTMLFormElement>, value: string) => {
    e.preventDefault();
    console.log('submitted', value);
    if (!/^[a-zA-Z0-9+-]+$/.test(value)) {
      setWordCloudInputError('Use only alphanumeric characters');
      return;
    }
    if (words.find(word => word.text === value) || addedWords.includes(value)) {
      setWordCloudInputError('Word already added');
      return;
    }
    setWords(prev => [...prev, {text: value, value: 200}].sort((a, b) => a.text.localeCompare(b.text)));
  }

  return (
    <>
      <h1>WordCloud</h1>
      <Matrix words={addedWords} />
      <PillToggle
        options={['Word Cloud', 'Dictionary']}
        selected={display}
        selectedColor="var(--c-green)"
        handleClick={handleDisplayChange}
      />
      {display === 'Word Cloud' && <WordCloud
        words={words}
        error={wordCloudInputError}
        handleClick={handleWordCloudClick}
        handleInput={handleWordCloudInput}
        handleSubmit={handleWordCloudSubmit}
      />}
      {display === 'Dictionary' && <Dictionary words={addedWords} />}
    </>
  )
}

export default App
