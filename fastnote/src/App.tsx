import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import { AppMode } from './types/types';
import Edit from './components/Edit';

function App() {

  const handleModeChange = (newMode: AppMode) => setMode(newMode);

  const [ mode, setMode ] = useState<AppMode>('edit');
  return (
    <>
      <Header handleModeChange={handleModeChange} />
      <main>
        {mode === 'edit' && <Edit />}
      </main>
    </>
  )
}

export default App;
