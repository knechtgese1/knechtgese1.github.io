import { useState } from 'react';
import './App.css';
import Keypad from './components/Keypad';
import { meters } from './constants/constants';
import { Measure } from './types/types';

function App() {
  const [noteMap, setNoteMap] = useState<Measure[]>([
    {
      meter: '$4',
      fill: 'qqqq'
    },
    { meter: '$4',
      fill: 'qqqq',
    }
  ])

  const handleKeySelect = (key: string, num: number) => {
    const chosenMeter = meters.find(meter => meter.key === key)!;
    const addedMeters: Measure[] = [];
    for (let i = 0; i < num; i++) {
      addedMeters.push({
        meter: chosenMeter.display,
        fill: chosenMeter.defaultFill!
      });
    }
    setNoteMap(prev => [...prev, ...addedMeters]);
  };

  return (
    <>
      <h1>ClickTrackr</h1>
      <div className="notes">{noteMap.map(((measure, i) => <span key={i}>{measure.meter !== noteMap[i - 1]?.meter ? measure.meter : ''}{measure.fill}{i === noteMap.length - 1 ? '\\|' : '\\'} </span>))}</div>
      <Keypad handleKeySelect={handleKeySelect} />
    </>
  )
}

export default App
