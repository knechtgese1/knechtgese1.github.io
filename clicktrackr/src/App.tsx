import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import Keypad from './components/Keypad';
import { meters } from './constants/constants';
import type { AdditiveMeter, Measure } from './types/types';
import CustomMeter from './components/CustomMeter';
import TimeSig from './components/TimeSig';
import { getFill, isSameMeter } from './utils/utils';
import { buildClickTimeline } from './click/timeline';
import { ClickPlayer } from './click/player';

function App() {
  const [noteMap, setNoteMap] = useState<Measure[]>([
    {
      num: 4,
      den: 4,
      fill: 'qqqq',
    },
    {
      num: 4,
      den: 4,
      fill: 'qqqq',
    },
  ]);

  const [showCustomModal, setShowCustomModal] = useState(false);

  const [bpm, setBpm] = useState<number>(120);

  const playerRef = useRef<ClickPlayer | null>(null);
  if (!playerRef.current) {
    playerRef.current = new ClickPlayer();
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showCustomModal) return;

      // ESC closes the modal.
      if (event.key === 'Escape') {
        setShowCustomModal(false);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCustomModal]);

  const handleKeySelect = (key: string, num: number) => {
    if (key === 'n') {
      setShowCustomModal(true);
      return;
    }

    const chosenMeter = meters.find((meter) => meter.key === key);
    if (!chosenMeter || !chosenMeter.num || !chosenMeter.den || !chosenMeter.defaultFill) return;

    const addedMeters: Measure[] = [];
    for (let i = 0; i < num; i++) {
      addedMeters.push({
        display: chosenMeter.display,
        alt: chosenMeter.alt,
        num: chosenMeter.num,
        den: chosenMeter.den,
        fill: chosenMeter.defaultFill,
        grouping: chosenMeter.subdiv,
      });
    }
    setNoteMap((prev) => [...prev, ...addedMeters]);
  };

  const setCustomMeter = (
    num: number,
    den: number,
    additiveMeters: AdditiveMeter[],
    subdivideAll: boolean,
  ) => {
    setNoteMap((prev) => [
      ...prev,
      {
        num,
        den,
        fill: getFill(additiveMeters, subdivideAll),
        grouping: additiveMeters
          .map((m) => (typeof m.numerator === 'number' ? m.numerator : null))
          .filter((n): n is number => !!n),
      },
    ]);
    setShowCustomModal(false);
  };

  const timeline = useMemo(() => {
    const safeBpm = Number.isFinite(bpm) && bpm > 10 ? bpm : 120;
    return buildClickTimeline(noteMap, { bpm: safeBpm });
  }, [noteMap, bpm]);

  const isPlaying = playerRef.current.getState().isPlaying;

  const handlePlayStop = () => {
    const player = playerRef.current!;

    if (player.getState().isPlaying) {
      player.stop();
      return;
    }

    player.setTimeline(timeline);
    player.play();
  };

  return (
    <>
      <h1>ClickTrackr</h1>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: '0.75rem 0' }}>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span>BPM</span>
          <input
            type="number"
            min={20}
            max={400}
            step={1}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            style={{ width: '6rem' }}
          />
        </label>
        <button onClick={handlePlayStop}>{isPlaying ? 'Stop' : 'Play'}</button>
        <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>{timeline.length} clicks</span>
      </div>

      <div className="notes">
        {noteMap.map((measure, i) => {
          const prev = noteMap[i - 1];
          const showMeter = !isSameMeter(measure, prev);
          const meterEl = measure.display ? (
            <TimeSig display={measure.display} alt={measure.alt} />
          ) : (
            <TimeSig num={measure.num} den={measure.den} />
          );

          return (
            <div className="measure" key={i}>
              {showMeter ? meterEl : ''}
              {measure.fill}
              {i === noteMap.length - 1 ? '\\|' : '\\'}
            </div>
          );
        })}
      </div>

      <Keypad handleKeySelect={handleKeySelect} />
      {showCustomModal && (
        <CustomMeter setCustomMeter={setCustomMeter} handleCloseModal={() => setShowCustomModal(false)} />
      )}
    </>
  );
}

export default App
