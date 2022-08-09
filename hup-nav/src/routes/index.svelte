<script lang="ts">
  import { fly, fade } from 'svelte/transition';

  let mode = 'list';

  let roomError = false;

  let roomNumber = '';

  let allowSubmit = false;

  let roomList: number[] = [];

  const validateRoomNumber = (room: number) => {
    return ((room % 100) > 0 && (room % 100) < 73 && room < 1500 && room > 700);
  }

  const handleKey = (key: number | string) => {
    if (typeof(key) === 'number' && roomNumber.length < 5) {
      roomNumber += key.toString();
      roomError = false;
    }
    if (key === 'back') {
      roomNumber = roomNumber.slice(0, -1);
    }
    roomError = roomNumber.length > 4;
    allowSubmit = validateRoomNumber(Number(roomNumber));
    if (key === 'enter') {
      if (!validateRoomNumber(Number(roomNumber))) {
        roomError = true;
        roomNumber = '';
        allowSubmit = false;
      } else {
        roomList[roomList.length] = Number(roomNumber);
        roomNumber = '';
        allowSubmit = false;
      }
    }
  };

  const handleDelete = (index: number) => {
    console.log(index);
    roomList.splice(index, 1);
    roomList = roomList;
  };

  const moveUp = (index: number) => {
    let temp = roomList[index - 1];
    roomList[index - 1] = roomList[index];
    roomList[index] = temp;
  };
  const moveDown = (index: number) => {
    let temp = roomList[index + 1];
    roomList[index + 1] = roomList[index];
    roomList[index] = temp;
  };

  let cwPassedElevator = '';
  let ccwPassedElevator = '';
  const shortestPath = (start: number, end: number) => {
    let cwWalker = start % 100;
    let ccwWalker = start % 100; //just room number
    let endRoom = end % 100;
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

  const navigate = (start: number, end: number) => {
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
      result.push(`Take elevator ${cwPassedElevator || ccwPassedElevator} to floor ${(end - end % 100) / 100}`);
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
    result.push(`Take elevator ${elevator} to floor ${(end - end % 100)/ 100}`);
    result.push(`Turn ${firstPath === 'clockwise' ? 'left' : 'right'}`);
    result.push(`Walk to room ${end}`);
    return result;
  };

  let currentDirections: string[] = [];

  $: if (roomList.length > 1) {
    currentDirections = navigate(roomList[0], roomList[1]);
  } else {
    currentDirections = ['No more rooms!'];
  }

  const handleDone = () => {
    if (roomList.length > 0) {
      roomList.shift();
    }
    roomList = roomList;
  }
</script>

<div class="main">
  <div class="buttons">
    <button on:click={() => mode = 'list'} class="button-list">
      LIST
    </button>
    <button on:click={() => mode = 'navigate'} disabled={roomList.length < 1} class="button-navigate">
      DIRECT
    </button>
  </div>
  {#if mode === 'list'}
    {#key mode}
      <div class="wrapper" in:fly="{{ y: 200, duration: 2000 }}" out:fade>
        <div class="display">
          <div class="display-content">
            <span class="unit">ROOM</span>
            <span class="room">{roomNumber || '-'}</span>
          </div>
          <div class="display-error" class:error={roomError}>
            Enter a valid room number.
          </div>
        </div>
        <div class="keypad">
          <div class="number" on:click={() => handleKey(7)}>7</div>
          <div class="number" on:click={() => handleKey(8)}>8</div>
          <div class="number" on:click={() => handleKey(9)}>9</div>
          <div class="number" on:click={() => handleKey(4)}>4</div>
          <div class="number" on:click={() => handleKey(5)}>5</div>
          <div class="number" on:click={() => handleKey(6)}>6</div>
          <div class="number" on:click={() => handleKey(1)}>1</div>
          <div class="number" on:click={() => handleKey(2)}>2</div>
          <div class="number" on:click={() => handleKey(3)}>3</div>
          <button class="back" disabled={roomNumber.length === 0} on:click={() => handleKey("back")}>BACK</button>
          <div class="number" on:click={() => handleKey(0)}>0</div>
          <button class="enter" disabled={!allowSubmit} on:click={() => handleKey("enter")}>↵</button>
        </div>
        <div class="roomlist">
          <div class="roomlist-header">
            <span>Queue</span>
            <span>Total: {roomList.length}</span>
          </div>
          <div class="room-queue">
            {#each roomList as room, index}
                <div class="room-queue-item" transition:fly="{{ y: 200, duration: 250 }}">
                  <span class="num">{room}</span>
                  <span class="symbol" on:click={() => moveUp(index)}>{(index > 0 && roomList.length > 1) ? '↑' : ' '}</span>
                  <span class="symbol" on:click={() => moveDown(index)}>{((index < roomList.length - 1) && roomList.length > 1) ? '↓' : ' '}</span>
                  <span class="delete" on:click={() => handleDelete(index)}>✗</span>
                </div>
            {/each}
          </div>
        </div>
      </div>
    {/key}
  {:else}
    {#key mode}
      {#key currentDirections}
        <div class="directions" in:fly="{{ y: 200, duration: 2000 }}" out:fade>
          {#each currentDirections as command}
            <div class="command">{command}</div>
          {/each}
          <button class="done" on:click={handleDone}>DONE</button>
        </div>
      {/key}
    {/key}
  {/if}
</div>

<style>
  :global(body) {
    background: black;
  }

  .buttons {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .button-list,
  .button-navigate {
    display: flex;
    width: 100%;
    height: 40px;
    border-radius: 10px;
    font-family: "Helvetica Neue";
    font-size: 20px;
    font-weight: 900;
    align-items: center;
    justify-content: center;
  }

  .button-list {
    background: pink;
  }

  .button-navigate {
    background: lightblue;
  }

  .display {
    margin-top: 20px;
    border: 2px solid grey;
    border-radius: 10px;
    height: 50px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    font-family:Arial, Helvetica, sans-serif;
  }

  .display-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .display-error {
    position: relative;
    bottom: 5px;
    visibility: hidden;
    color: black;
    text-align: center;
  }

  .display-error.error {
    visibility: visible;
    color: red;
  }

  .unit {
    color: yellow;
  }

  .room {
    color: white;
    font-size: 40px;
  }

  .keypad {
    margin-top: 20px;
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr 1fr;
    background: #404040;
    border-radius: 10px;
  }

  .number,
  .back,
  .enter {
    display: flex;
    border-radius: 10px;
    height: 50px;
    margin: 5px;
    font-size: 40px;
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    align-items: center;
    justify-content: center;
  }

  .number {
    background: goldenrod;
  }

  .back {
    background: rgba(255, 0, 0, 0.75);
    font-size: 20px;
  }

  .enter {
    background: rgba(128, 255, 128, 0.75);
  }

  .roomlist {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }

  .roomlist-header {
    display: flex;
    padding: 10px;
    justify-content: space-between;
    background: goldenrod;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 900;
  }

  .room-queue {
    height: 300px;
    overflow: scroll;
  }

  .room-queue-item {
    margin: 2px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    background: rgba(0, 255, 255, 0.60);
    color: white;
    font-family: "Helvetica Neue", Helvetica, Arial;
    font-size: 20px;
  }

  .room-queue-item .num {
    width: 100%;
  }

  .room-queue-item .symbol {
    width: 50%;
  }

  .delete {
    color: red;
    width: 10%;
  }

  .directions {
    margin-top: 50px;
    padding-bottom: 50px;
    width: 100%;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    background: rgb(53, 7, 7);
  }

  .command {
    margin: 30px;
    color: green;
    font-family:Arial, Helvetica, sans-serif;
    font-size: 25px;
    font-weight: 700;
  }

  .done {
    padding: 10px 20px;
    text-align: center;
    font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-size: 50px;
    background: goldenrod;
    border-radius: 10px;
  }
</style>