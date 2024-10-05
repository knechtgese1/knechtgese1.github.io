import './App.css'
import { useState } from 'react';
import Matrix from './components/Matrix';
import WordCloud from './components/Wordcloud';
import PillToggle from './components/PillToggle';
import Dictionary from './components/Dictionary';
import { vibrate } from './utils/utils';
import ValidateModal from './components/ValidateModal';

function App() {

  type User = {
    id: number;
    handle: string;
    firstName: string;
    lastName: string;
  };
  type Word = {
    text: string;
    value: number;
    user: number;
  }
  //TODO: add to database and fix User ID
  //TODO: move these to state and database fetches
  const fakeWords: Word[] = [
    {
      text: 'Sample',
      value: 500,
      user: 1,
    },
    {
      text: 'word',
      value: 300,
      user: 2,
    },
    {
      text: 'Cloud',
      value: 250,
      user: 1,
    },
    {
      text: 'transmogrification',
      value: 500,
      user: 2,
    }
  ];

  const addedFakeWords = ['glomerulonephritis', 'anuric', 'hyperphosphatemia', 'hyponatremia'];

  const [display, setDisplay] = useState('Word Cloud');
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    handle: 'user',
    firstName: 'Sam',
    lastName: 'Smith',
  });
  const [mode, setMode] = useState('User');
  const [words, setWords] = useState(fakeWords);
  const [addedWords, setAddedWords] = useState(addedFakeWords);
  const [wordCloudInputError, setWordCloudInputError] = useState('');
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [validatedWord, setValidatedWord] = useState<Word | null>(null);

  const handleDisplayChange = (value: string) => {
    console.log('change to', value);
    vibrate(50);
    setDisplay(value);
  }

  const handleModeChange = (value: string) => {
    setMode(value);
    // TODO: Fix the hardcoded id values here -- Admin is 2, User is 1
    setCurrentUser(user => {return {...user, id: value === 'Admin' ? 2 : 1}})
  }

  const handleWordCloudClick = (text: string) => {
    console.log('clicked', text);
    const word = words.find(word => word.text === text);
    if (mode === 'Admin' && word) validateWord(word);
    if (mode === 'User' && word && word.user !== currentUser.id) toggleUpvote(word);
    vibrate(50);
  }

  const handleWordCloudInput = () => {
    setWordCloudInputError('');
    vibrate(50);
  }

  const handleWordCloudSubmit = (e: React.FormEvent<HTMLFormElement>, value: string) => {
    e.preventDefault();
    vibrate(100);
    console.log('submitted', value);
    if (!/^[a-zA-Z0-9+-]+$/.test(value)) {
      setWordCloudInputError('Use only alphanumeric characters');
      return;
    }
    if (wordExists(value)) {
      setWordCloudInputError('Word already added');
      return;
    }
    //TODO: send to the API endpoint
    setWords(prev => [...prev, {text: value, value: 200, user: currentUser.id}].sort((a, b) => a.text.localeCompare(b.text)));
  }

  const validateWord = (word: Word) => {
    setValidatedWord(word);
    setIsValidateModalOpen(true);
  }

  const wordExists = (value: string): boolean => !!words.find(word => word.text.toLocaleLowerCase() === value.toLocaleLowerCase()) || addedWords.includes(value);

  const handleApprove = (valWord: Word) => {
    // TODO: PATCH to approve word
    setAddedWords(prev => [...prev, valWord.text]);
    setWords(prev => prev.filter(word => word.text !== valWord.text));
    setIsValidateModalOpen(false);
  }

  const handleReject = (valWord: Word) => {
    // TODO: DELETE to remove word
    setWords(prev => prev.filter(word => word.text !== valWord.text));
    setIsValidateModalOpen(false);
  }

  const toggleUpvote = (word: Word) => {
    console.log('upvote', word.text);
  }

  return (
    <>
      <PillToggle
        options={['User','Admin']}
        selected={mode}
        selectedColor="var(--c-blue)"
        handleClick={handleModeChange}
      />
      <h1>WordCloud</h1>
      <Matrix words={addedWords} />
      <PillToggle
        options={['Word Cloud', 'Dictionary']}
        selected={display}
        selectedColor="var(--c-green)"
        handleClick={handleDisplayChange}
      />
      {display === 'Word Cloud' && <WordCloud
        currentUser={currentUser.id}
        words={words}
        error={wordCloudInputError}
        handleClick={handleWordCloudClick}
        handleInput={handleWordCloudInput}
        handleSubmit={handleWordCloudSubmit}
      />}
      {display === 'Dictionary' && <Dictionary words={addedWords} />}
      {isValidateModalOpen && validatedWord && <ValidateModal
        word={validatedWord.text}
        onClose={() => setIsValidateModalOpen(false)}
        onApprove={() => handleApprove(validatedWord)}
        onReject={() => handleReject(validatedWord)}
      />}
    </>
  )
}

export default App
