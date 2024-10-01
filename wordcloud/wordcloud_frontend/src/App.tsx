import './App.css'
import { useState } from 'react';
import Matrix from './Matrix';
import WordCloud from './Wordcloud';
import PillToggle from './PillToggle';
import Dictionary from './Dictionary';

function App() {

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

  type Display = 'wordcloud' | 'dictionary';
  const [display, setDisplay] = useState<Display>('wordcloud');
  const [words, setWords] = useState(fakeWords);

  const handleDisplayChange = (value: Display) => {
    console.log('change to', value);
    setDisplay(value);
  }

  const handleWordCloudClick = (text: string) => {
    console.log('clicked', text);
  }

  const handleWordCloudSubmit = (e: React.FormEvent<HTMLFormElement>, value: string) => {
    e.preventDefault();
    console.log('submitted', value);
    setWords(prev => [...prev, {text: value, value: 200}]);
  }

  return (
    <>
      <h1>WordCloud</h1>
      <Matrix words={addedWords} />
      <PillToggle
        selected={display}
        handleClick={handleDisplayChange}
      />
      {display === 'wordcloud' && <WordCloud
        words={words}
        handleClick={handleWordCloudClick}
        handleSubmit={handleWordCloudSubmit}
      />}
      {display === 'dictionary' && <Dictionary words={addedWords} />}
    </>
  )
}

export default App
