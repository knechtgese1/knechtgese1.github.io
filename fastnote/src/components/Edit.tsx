import './Edit.css'
import ButtonGroup from './subcomponents/ButtonGroup';
import { FormEvent, useState } from 'react';
import { getDefByIndex, getDefByName } from '../helpers/helpers';

//const next = ['ESRD', 'AKI', 'OTHER'];

function Edit() {

  const [ index, setIndex ] = useState(0);
  const [ notes, setNotes ] = useState<string[]>([]);
  const currentDef = getDefByIndex(index)!;
  const currentOptions = currentDef.options?.map(option => getDefByIndex(option)!) || [];
  const handleClick = (name: string) => {
    setNotes((notes) => [...notes, (getDefByName(name)!.text || '')])
    const newIndex = getDefByName(name)?.index;
    if (newIndex) setIndex(newIndex);
  };
  const handleEdit = (i: number, e: FormEvent) => {
    const notesCopy = [...notes];
    const target = e.target as HTMLDivElement;
    notesCopy[i] = target.textContent || '';
    setNotes(notesCopy);
  }

  return (
    <div className="edit-window">
      <div className="controls">
        <ButtonGroup options={currentOptions} handleClick={handleClick}/>
      </div>
      <div className="note">
        {notes.map((note, i) => <div key={i} contentEditable onInput={(event) => handleEdit(index, event)}>{note} </div>)}
      </div>
    </div>
  )
}

export default Edit;