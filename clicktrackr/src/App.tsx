import { useState } from 'react'
import './App.css'
import Keypad from './components/Keypad'

function App() {
  const [noteMap, setNoteMap] = useState(['$4qqqq', 'qqqq', 'rttyrtty'])

  const handleKeySelect = (key: string, num: number) => {
    console.log('handling', key, num);
    setNoteMap(['$4qqqq', 'qqqq']);
  }

  return (
    <>
      <h1>ClickTrackr</h1>
      <div className="notes">{noteMap.map(((measure, i) => <span key={i}>{measure}{i === noteMap.length - 1 ? '\\|' : '\\'} </span>))}</div>
      <Keypad handleKeySelect={handleKeySelect} />
    </>
  )
}

export default App
