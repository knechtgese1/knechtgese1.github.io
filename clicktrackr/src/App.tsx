import { useState } from 'react'
import './App.css'
import Keypad from './components/Keypad'

function App() {
  const [noteMap, setNoteMap] = useState(['$4qqqq', 'qqqq', 'rttyrtty'])

  return (
    <>
      <h1>ClickTrackr</h1>
      <div className="notes">{noteMap.map(((measure, i) => <span>{measure}{i === noteMap.length - 1 ? '\\|' : '\\'} </span>))}</div>
      <Keypad />
    </>
  )
}

export default App
