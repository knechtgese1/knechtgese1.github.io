

let cwPassedElevator = '';
let ccwPassedElevator = '';
const shortestPath = (start: number, end: number) => {
  let cwWalker = start % 100;
  let ccwWalker = start % 100; //just room number
  const endRoom = end % 100;
  let cwCounter = 0;
  let ccwCounter = 0;
  //clockwise first
  while (cwWalker !== endRoom) {
    if (cwWalker % 36 === 0) { //passing 36 or 72
      cwCounter += 5; //going through the lounge
    }
    if (cwWalker === 12) {
      cwPassedElevator = 'B'; //elevator flag
    }
    if (cwWalker === 48) {
      cwPassedElevator = 'A';
    }
    cwWalker++; //walk one room cw
    if (cwWalker === 73) cwWalker = 1;
    cwCounter++; //count the distance
  }
  while (ccwWalker !== endRoom) {
    if (ccwWalker % 36 === 1) {
      ccwCounter += 5; //going through the lounge
    }
    if (ccwWalker === 13) {
      ccwPassedElevator = 'B'; //elevator flag
    }
    if (ccwWalker === 49) {
      ccwPassedElevator = 'A';
    }
    ccwWalker--; //walk one room ccw
    if (ccwWalker === 0) ccwWalker = 72;
    ccwCounter++; //count the distance
  }
  return {
    distance: Math.min(cwCounter, ccwCounter),
    direction: cwCounter < ccwCounter ? 'clockwise' : 'counter-clockwise'
  };
};

const needElevator = (start: number, end: number) => {
  return (start - start % 100) !== (end - end % 100);
};

export const navigate = (start: number, end: number) => {
  cwPassedElevator = '';
  ccwPassedElevator = '';
  const result: string[] = [];
  result.push(`Exit room ${start}`);
  const path = shortestPath(start, end).direction;
  if (!needElevator(start, end)) {
    result.push(`Turn ${path === 'clockwise' ? 'left' : 'right'}`);
    result.push(`Walk to room ${end}`);
    return result;
  }
  if ((shortestPath(start, end).direction === 'clockwise' && cwPassedElevator) || (shortestPath(start, end).direction === 'counter-clockwise' && ccwPassedElevator)) {
    result.push(`Turn ${path === 'clockwise' ? 'left' : 'right'}`);
    result.push(`Take lift ${cwPassedElevator || ccwPassedElevator} to floor ${(end - end % 100) / 100}`);
    result.push(`Turn ${path === 'clockwise' ? 'right' : 'left'}`);
    result.push(`Walk to room ${end}`);
    return result;
  }
  const startToA = Math.min(shortestPath(start, 48).distance, shortestPath(start, 49).distance);
  const startToB = Math.min(shortestPath(start, 12).distance, shortestPath(start, 13).distance);
  const endToA = Math.min(shortestPath(end, 48).distance, shortestPath(end, 49).distance);
  const endToB = Math.min(shortestPath(end, 12).distance, shortestPath(end, 13).distance);
  let firstPath = '';
  let elevator = '';
  if (Math.min(startToA, startToB, endToA, endToB) === startToA || Math.min(startToA, startToB, endToA, endToB) === endToA) {
    elevator = "A";
    if (startToA > 0 && endToA > 0) {
      firstPath = shortestPath(start, 48).direction;
    } else {
      firstPath = start % 100 === 48 ? 'clockwise' : 'counter-clockwise';
    }
  } else {
    elevator = "B";
    if (startToB > 0 && endToB > 0) {
      firstPath = shortestPath(start, 12).direction;
    } else {
      firstPath = start % 100 === 12 ? 'clockwise' : 'counter-clockwise';
    }
  }
  result.push(`Turn ${firstPath === 'clockwise' ? 'left' : 'right'}`);
  result.push(`Take lift ${elevator} to floor ${(end - end % 100)/ 100}`);
  result.push(`Turn ${firstPath === 'clockwise' ? 'left' : 'right'}`);
  result.push(`Walk to room ${end}`);
  return result;
};


const normalOrder = (list: number[], modulus: number) => {
  list.sort((a, b) => a - b);
  if (list.length < 3) return list;
  let distance;
  let index = 0;
  let maxDistance = 0;
  let maxDistanceIndex = 0;
  for (let n = 0; n < list.length; n++) {
    if (list[n + 1]) {
      distance = list[n + 1] - list[n];
      index = n + 1;
    } else {
      distance = list[0] - list[list.length - 1] + modulus;
      index = 0;
    }
    if (distance > maxDistance) {
      maxDistance = distance;
      maxDistanceIndex = index;
    }
  }
  const result = list.slice(maxDistanceIndex).concat(list.slice(0, maxDistanceIndex));
  return result;
}

export const sortRoomList = (list: number[], direction: string) => {
  let listByFloor = [];
  const start = direction === 'top-down' ? 14 : 7;
  const end = direction === 'top-down' ? 6 : 15;
  const step = Math.sign(end - start);
  for (let floor = start; floor !== end; floor += step) {
    listByFloor.push(normalOrder(list.filter(num => Math.floor(num / 100) === floor), 72));
  }
  listByFloor = listByFloor.filter(floor => floor.length > 0);
  if (listByFloor.length > 1 && listByFloor[0].length > 1) {
    const f1 = listByFloor[0][0];
    const l1 = listByFloor[0][listByFloor[0].length - 1];
    const f2 = listByFloor[1][0];
    const l2 = listByFloor[1][listByFloor[1].length - 1];
    const f = shortestPath(f1, f2).distance;
    const o = shortestPath(f1, l2).distance;
    const i = shortestPath(l1, f2).distance;
    const l = shortestPath(l1, l2).distance;
    if (Math.min(f, o, i, l) === f || Math.min(f, o, i, l) === o) {
      listByFloor[0].reverse();
    }
  }
  for (let i = 0; i < listByFloor.length - 1; i++) {
    if (listByFloor[i + 1].length === 1) continue;
    const currentLastRoom = listByFloor[i][listByFloor[i].length - 1];
    const nextFirstRoom = listByFloor[i + 1][0];
    const nextLastRoom = listByFloor[i + 1][listByFloor[i + 1].length - 1];
    if (shortestPath(currentLastRoom, nextFirstRoom).distance > shortestPath(currentLastRoom, nextLastRoom).distance) {
      listByFloor[i + 1].reverse();
    }
  }
  return listByFloor.flat();
};