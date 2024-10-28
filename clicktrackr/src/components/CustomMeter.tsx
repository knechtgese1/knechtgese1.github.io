import { useEffect, useRef, useState } from "react";
import { subdivisions, meterNumeratorMap, meterDenominatorMap } from "../constants/constants";
import Dropdown from "./Dropdown";
import "./CustomMeter.css";

type CustomMeterProps = {
  handleCustomMeter: () => void;
  handleCloseModal: () => void;
}

type AdditiveMeter = {
  numerator: number | '';
  denominator: number;
}

function CustomMeter({handleCustomMeter, handleCloseModal}: CustomMeterProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  const [additiveMeters, setAdditiveMeters] = useState<AdditiveMeter[]>([
    {
      numerator: '',
      denominator: 8,
    },
    {
      numerator: '',
      denominator: 8,
    }
  ]);

  const [compositeMeter, setCompositeMeter] = useState<AdditiveMeter>({
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

  const getMeterDisplay = (meter: AdditiveMeter) => {
    let numeratorDisplay = '';
    let shiftDenominator = false;
    const num = meter.numerator as number;
    if (num < 11 || num === 12) {
      numeratorDisplay += meterNumeratorMap[num - 1];
    } else {
      numeratorDisplay += meterNumeratorMap[Math.floor(num / 10) - 1] + ' ' + meterNumeratorMap[num % 10 - 1];
      shiftDenominator = true;
    }
    const denominatorDisplay = meterDenominatorMap[Math.log2(compositeMeter.denominator)];
    return (
      <>
        <span className="numerator">{numeratorDisplay}</span>
        <span className={`denominator ${shiftDenominator ? 'shift-left' : ''}`}>{denominatorDisplay}</span>
      </>
    );
  }

  return (
    <dialog id="custom-meter-modal" ref={dialog} onClick={handleClick}>
      <form>
        <h2>Custom Meter</h2>
        <div className="meter-display">
          {compositeMeter.numerator &&
            <>
              <h3>Display Meter</h3>
              <div className="meter">{getMeterDisplay(compositeMeter)}</div>
            </>
          }
        </div>
        <div className="meter-input">
          {additiveMeters.map((meter, i) => (
            <>
            <div className="meter" key={`meter-${i}`}>
              <input type="number" min="1" placeholder="?" value={meter.numerator} onInput={(e) => handleNumeratorChange(e, i)}/>
              <hr />
              <Dropdown options={subdivisions} onChange={(value) => handleDenominatorChange(value, i)}/>
            </div>
            <button>+</button>
            </>
          ))}
        </div>
        <button onClick={handleCustomMeter}>OK</button>
      </form>
    </dialog>
  );
};

export default CustomMeter;