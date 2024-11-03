import { useEffect, useReducer, useRef, useState } from "react";
import {v4 as uuid} from 'uuid';
import { subdivisions } from "../constants/constants";
import Dropdown from "./Dropdown";
import "./CustomMeter.css";
import TimeSig from "./TimeSig";
import { AdditiveMeter } from '../types/types';

type CustomMeterProps = {
  setCustomMeter: (num: number, den: number, meters: AdditiveMeter[], subdivide: boolean) => void;
  handleCloseModal: () => void;
}

function CustomMeter({setCustomMeter, handleCloseModal}: CustomMeterProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const subdivide = useRef<HTMLInputElement>(null);

  const ACTIONS = {
    SET_NUMERATOR: 'set-numerator',
    SET_DENOMINATOR: 'set-denominator',
    ADD_METER: 'add-meter',
    DELETE_METER: 'delete-meter',
  } as const;

  type AdditiveMeterAction =
  | { type: 'set-numerator'; payload: { e: React.FormEvent<HTMLInputElement>, i: number } }
  | { type: 'set-denominator'; payload: { i: number, value: number } }
  | { type: 'add-meter'; payload: { i: number } }
  | { type: 'delete-meter'; payload: { id: string}};

  const additiveMeterReducer = (state: AdditiveMeter[], {type, payload}: AdditiveMeterAction) => {
    switch (type) {
      case ACTIONS.SET_NUMERATOR: {
        const {e, i} = payload;
        const input = e.target as HTMLInputElement;
        const currentMeters = [...state];
        currentMeters[i].numerator = parseInt(input.value) || '';
        return currentMeters;
      }
      case ACTIONS.SET_DENOMINATOR: {
        const {i, value} = payload;
        const currentMeters = [...state];
        currentMeters[i].denominator = value;
        return currentMeters;
      }
      case ACTIONS.ADD_METER: {
        const {i} = payload;
        const largestDenominator = Math.max(...state.map(meter => meter.denominator));
        const currentMeters = [...state];
        currentMeters.splice(i + 1, 0, {
          id: uuid(),
          numerator: '',
          denominator: largestDenominator,
        });
        return currentMeters;
      }
      case ACTIONS.DELETE_METER: {
        const {id} = payload;
        return [...state].filter(meter => meter.id !== id);
      }
      default: {
        return state;
      }
    }
  }

  const [additiveMeters, dispatchAdditiveMeters] = useReducer(additiveMeterReducer, [
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

  return (
    <dialog id="custom-meter-modal" ref={dialog} onClick={handleClick}>
      <form onSubmit={(e) => {
        e.preventDefault();
        setCustomMeter(compositeMeter.numerator as number, compositeMeter.denominator, additiveMeters, subdivide.current?.checked || false);
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
        <label className="subdivide">
            Subdivide all clicks<input ref={subdivide} name="subdivide" type="checkbox" />
        </label>
        <div className="meter-input">
          {additiveMeters.map((meter, i) => (
            <div key={meter.id}>
              <div className="meter">
                <input type="number" min="1" max="3" placeholder="?" value={meter.numerator} onInput={(e) => dispatchAdditiveMeters({type: ACTIONS.SET_NUMERATOR, payload: {e, i}})}/>
                <hr />
                <Dropdown options={subdivisions} onChange={(value) => dispatchAdditiveMeters({type: ACTIONS.SET_DENOMINATOR, payload: {value, i}})}/>
                {additiveMeters.length > 1 && <button className="remove-meter" onClick={() => dispatchAdditiveMeters({type: ACTIONS.DELETE_METER, payload: {id: meter.id!}})}>-</button>}
              </div>
              <button className="add-meter" type="button" onClick={() => dispatchAdditiveMeters({type: ACTIONS.ADD_METER, payload: {i}})}>+</button>
            </div>
          ))}
        </div>
        <button type="submit" className="submit" disabled={!compositeMeter.numerator}>OK</button>
      </form>
    </dialog>
  );
};

export default CustomMeter;