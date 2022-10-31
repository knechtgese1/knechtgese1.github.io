export const orderOfSharps = 'FCGDAEB';

export const clefs = ['treble', 'bass', 'alto', 'tenor'];

const getNoteName = (noteName: string) => {
  return noteName.replace(/[0-9]/g, '');
}

const getAccidental = (noteName: string) => {
  noteName = getNoteName(noteName);
  return noteName.length === 1 ? 'natural' : (noteName[1] === "#" ? 'sharp' : 'flat');
}

const getOctave = (noteName: string) => {
  return Number(noteName.match(/\d/g));
}

const needButtonAccidental = (noteName: string, keySig: number) => {
  if (getAccidental(noteName) != 'natural') return true;
  return (keySig > orderOfSharps.indexOf(noteName[0]) || keySig < (orderOfSharps.indexOf(noteName[0]) - 6))
}

const needStaffAccidental = (noteName: string, keySig: number) => {
  const accidental = getAccidental(noteName);
  if (accidental === 'natural') {
    return needButtonAccidental(noteName, keySig);
  }
  if (accidental === 'sharp') {
    return (keySig <= orderOfSharps.indexOf(noteName[0]));
  }
  return (keySig >= (orderOfSharps.indexOf(noteName[0]) - 6));
}

type Note = { 
  noteName: string;
  octave: number;
  letterName: string;
  accidental: string;
  buttonAccidental: boolean;
  staffAccidental: boolean;
}

export const parseNote = (noteName: string, keySig: number) => {
  const fullNote: Note = {
    noteName: getNoteName(noteName),
    octave: getOctave(noteName),
    letterName: noteName[0],
    accidental: getAccidental(noteName),
    buttonAccidental: needButtonAccidental(noteName, keySig),
    staffAccidental: needStaffAccidental(noteName, keySig),
  };
  return fullNote;
}