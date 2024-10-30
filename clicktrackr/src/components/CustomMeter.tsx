import { useEffect, useRef, useState } from "react";
import {v4 as uuid} from 'uuid';
import { subdivisions } from "../constants/constants";
import Dropdown from "./Dropdown";
import "./CustomMeter.css";
import TimeSig from "./TimeSig";

type CustomMeterProps = {
  setCustomMeter: () => void;
  handleCloseModal: () => void;
}

type AdditiveMeter = {
  id?: string;
  numerator: number | '';
  denominator: number;
}

function CustomMeter({setCustomMeter, handleCloseModal}: CustomMeterProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  const [additiveMeters, setAdditiveMeters] = useState<AdditiveMeter[]>([
    {
      id: uuid(),
      numerator: '',
      denominator: 8,
    },
    {
      id: uuid(),
      numerator: '',
      denominator: 8,
    }
  ]);

  const [compositeMeter, setCompositeMeter] = useState<AdditiveMeter>({
    id: uuid(),
    numerator: '',
    denominator: 8,
  });

  useEffect(() => {
    if (dialog.current) {
      dialog.current.showModal();
    }
  }, []);

  // recalculate composite meter on change
  useEffect(() => {
    if (additiveMeters.some(meter => !meter.numerator))
      {
        setCompositeMeter({
          numerator: '',
          denominator: 8,
        });
        return;
      }
    const largestDenominator = Math.max(...additiveMeters.map(meter => meter.denominator));
    const sumNumerators = additiveMeters.map(meter => (meter.numerator as number) * (largestDenominator / meter.denominator)).reduce((acc, memo) => acc + memo);
    setCompositeMeter({
      numerator: sumNumerators,
      denominator: largestDenominator,
    });
  }, [additiveMeters])

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const target = e.target as HTMLElement;
    if (target === dialog.current) {
      dialog.current.close();
      handleCloseModal();
    }
  };

  const handleNumeratorChange = (e: React.FormEvent<HTMLInputElement>, i: number) => {
    const input = e.target as HTMLInputElement;
    const currentMeters = [...additiveMeters];
    currentMeters[i].numerator = parseInt(input.value) || '';
    setAdditiveMeters(currentMeters);
  };

  const handleDenominatorChange = (value: number, i: number) => {
    const currentMeters = [...additiveMeters];
    currentMeters[i].denominator = value;
    setAdditiveMeters(currentMeters);
  };

  const handleAddMeter = (i: number) => {
    const largestDenominator = Math.max(...additiveMeters.map(meter => meter.denominator));
    setAdditiveMeters(prev => {
      const tmp = [...prev];
      tmp.splice(i + 1, 0, {
        id: uuid(),
        numerator: '',
        denominator: largestDenominator,
      });
      return tmp;
    });
  };

  const handleRemoveMeter = (id: string) => {
    setAdditiveMeters(prev => [...prev].filter(meter => meter.id !== id));
  };

  return (
    <dialog id="custom-meter-modal" ref={dialog} onClick={handleClick}>
      <form onSubmit={(e) => {
        e.preventDefault();
        setCustomMeter(compositeMeter.numerator, compositeMeter.denominator);
      }}>
        <h2>Custom Meter</h2>
        <div className="meter-display">
          {compositeMeter.numerator &&
            <>
              <h3>Display Meter</h3>
              <div className="meter">
                <TimeSig num={compositeMeter.numerator} den={compositeMeter.denominator!} />
              </div>
            </>
          }
        </div>
        <div className="meter-input">
          {additiveMeters.map((meter, i) => (
            <div key={meter.id}>
              <div className="meter">
                <input type="number" min="1" placeholder="?" value={meter.numerator} onInput={(e) => handleNumeratorChange(e, i)}/>
                <hr />
                <Dropdown options={subdivisions} onChange={(value) => handleDenominatorChange(value, i)}/>
                {additiveMeters.length > 1 && <button className="remove-meter" onClick={() => handleRemoveMeter(meter.id!)}>-</button>}
              </div>
              <button className="add-meter" onClick={() => handleAddMeter(i)}>+</button>
            </div>
          ))}
        </div>
        <button className="submit" disabled={!compositeMeter.numerator}>OK</button>
      </form>
    </dialog>
  );
};

export default CustomMeter;