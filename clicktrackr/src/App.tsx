import { useState } from 'react';
import './App.css';
import Keypad from './components/Keypad';
import { meters } from './constants/constants';
import { AdditiveMeter, Measure } from './types/types';
import CustomMeter from './components/CustomMeter';
import TimeSig from './components/TimeSig';
import { getFill, isSameMeter } from './utils/utils';

function App() {
  //TODO: get rid of this placeholder
  const [noteMap, setNoteMap] = useState<Measure[]>([
    {
      meter: <TimeSig num={4} den={4} />,
      num: 4,
      den: 4,
      fill: 'qqqq'
    },
    { meter: <TimeSig num={4} den={4} />,
      num: 4,
      den: 4,
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
        meter: chosenMeter!.display ? <TimeSig display={chosenMeter!.display} alt={chosenMeter!.alt} /> : <TimeSig num={chosenMeter!.num!} den={chosenMeter!.den!} />,
        display: chosenMeter!.display,
        num: chosenMeter!.num!,
        den: chosenMeter!.den!,
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
  };

  const setCustomMeter = (num: number, den: number, additiveMeters: AdditiveMeter[], subdivideAll: boolean) => {
    setNoteMap(prev => [...prev, {
      meter: <TimeSig num={num} den={den} />,
      num,
      den,
      fill: getFill(additiveMeters, subdivideAll),
    }]);
    setShowCustomModal(false);
  }

  return (
    <>
      <h1>ClickTrackr</h1>
      <div className="notes">{noteMap.map(((measure, i) => <div className="measure" key={i}>{!isSameMeter(measure, noteMap[i - 1]) ? measure.meter : ''}{measure.fill}{i === noteMap.length - 1 ? '\\|' : '\\'} </div>))}</div>
      <Keypad handleKeySelect={handleKeySelect} />
      {showCustomModal && <CustomMeter setCustomMeter={setCustomMeter} handleCloseModal={handleCloseModal} />}
    </>
  )
}

export default App
