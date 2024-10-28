import { useState } from 'react';
import './App.css';
import Keypad from './components/Keypad';
import { meters } from './constants/constants';
import { Measure } from './types/types';
import CustomMeter from './components/CustomMeter';
import TimeSig from './components/TimeSig';

function App() {
  //TODO: get rid of this placeholder
  const [noteMap, setNoteMap] = useState<Measure[]>([
    {
      meter: '$4',
      fill: 'qqqq'
    },
    { meter: '$4',
      fill: 'qqqq',
    }
  ])

  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleKeySelect = (key: string, num: number) => {
    if (key === 'n') {
      handleCustomMeter();
      return;
    };
    const chosenMeter = meters.find(meter => meter.key === key);
    const addedMeters: Measure[] = [];
    for (let i = 0; i < num; i++) {
      addedMeters.push({
        meter: chosenMeter!.display,
        fill: chosenMeter!.defaultFill!
      });
    }
    setNoteMap(prev => [...prev, ...addedMeters]);
  };

  const handleCustomMeter = () => {
    setShowCustomModal(true);
  };

  const handleCloseModal = () => {
    setShowCustomModal(false);
  }

  return (
    <>
      <h1>ClickTrackr</h1>
      <div className="notes">{noteMap.map(((measure, i) => <span key={i}>{measure.meter !== noteMap[i - 1]?.meter ? measure.meter : ''}{measure.fill}{i === noteMap.length - 1 ? '\\|' : '\\'} </span>))}</div>
      <Keypad handleKeySelect={handleKeySelect} />
      {showCustomModal && <CustomMeter handleCustomMeter={handleCustomMeter} handleCloseModal={handleCloseModal} />}
    </>
  )
}

export default App
