import './App.css'
import { useState } from 'react';
import Matrix from './Matrix';
import WordCloud from './Wordcloud';

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
      value: 1000,
    }
  ];

  const addedWords = ['glomerulonephritis', 'anuric', 'hyperphosphatemia'];

  type Display = 'wordcloud' | 'dictionary';
  const [display] = useState<Display>('wordcloud');
  const [words, setWords] = useState(fakeWords);

  const handleWordCloudClick = (text: string) => {
    console.log('clicked', text);
    setWords(fakeWords.filter(word => word.text.length > 4));
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
      {display === 'wordcloud' && <WordCloud
        words={words}
        handleClick={handleWordCloudClick}
        handleSubmit={handleWordCloudSubmit}
      />}
    </>
  )
}

export default App
