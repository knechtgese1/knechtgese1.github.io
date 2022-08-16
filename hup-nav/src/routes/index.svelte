<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { navigate, sortRoomList } from './_utils'

  let mode = 'list';

  let roomError = false;

  let roomNumber = '';

  let allowSubmit = false;

  let roomListString = '';

  let roomList: number[] = [];

  let showClearModal = false;

  onMount(async () => {
    roomListString = localStorage.getItem('hup-navigator-room-list') || '';
    roomList = JSON.parse(roomListString || '[]');
  });

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
        localStorage.setItem('hup-navigator-room-list', JSON.stringify(roomList));
        roomNumber = '';
        allowSubmit = false;
      }
    }
  };

  const handleDelete = (index: number) => {
    console.log(index);
    roomList.splice(index, 1);
    roomList = roomList;
    localStorage.setItem('hup-navigator-room-list', JSON.stringify(roomList));
  };

  const moveUp = (index: number) => {
    let temp = roomList[index - 1];
    roomList[index - 1] = roomList[index];
    roomList[index] = temp;
    localStorage.setItem('hup-navigator-room-list', JSON.stringify(roomList));
  };
  const moveDown = (index: number) => {
    let temp = roomList[index + 1];
    roomList[index + 1] = roomList[index];
    roomList[index] = temp;
    localStorage.setItem('hup-navigator-room-list', JSON.stringify(roomList));
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
    localStorage.setItem('hup-navigator-room-list', JSON.stringify(roomList));
  };

  const handleSort = (direction: string) => {
    roomList = sortRoomList(roomList, direction);
    localStorage.setItem('hup-navigator-room-list', JSON.stringify(roomList));
  }

  const handleClear = () => {
    roomList = [];
    localStorage.setItem('hup-navigator-room-list', JSON.stringify(roomList));
    showClearModal = false;
  }
</script>

<div class="main" class:modal-show={showClearModal}>
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
            <button disabled={roomList.length < 2} on:click={() => handleSort('top-down')}>TOP-DOWN</button>
            <button disabled={roomList.length < 2} on:click={() => handleSort('bottom-up')}>BOTTOM-UP</button>
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
          <button class="clear" disabled={roomList.length < 1} on:click={() => showClearModal = true}>CLEAR QUEUE</button>
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
          <button class="done" class:hide={roomList.length < 2} on:click={handleDone}>NEXT</button>
        </div>
      {/key}
    {/key}
  {/if}
</div>

{#if showClearModal}
  <div class="modal">
    <div class="backdrop" />
    <div class="modal-content-wrapper">
      <div class="modal-content">
        <span>Clear all rooms?</span>
        <div class="modal-buttons">
          <button on:click={handleClear}>YES</button>
          <button on:click={() => showClearModal = false}>NO</button>
        </div>
      </div>
    </div>
  </div>
{/if}

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
    color: black;
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
    width: 75%;
    margin: auto;
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
    height: 30px;
    margin: 5px;
    font-size: 20px;
    font-family: sans-serif;
    align-items: center;
    justify-content: center;
  }

  .number {
    background: goldenrod;
  }

  .back {
    background: rgba(255, 0, 0, 0.75);
    font-size: 10px;
    color: black;
  }

  .enter {
    background: rgba(128, 255, 128, 0.75);
    color: black;
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
    align-items: center;
    background: goldenrod;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 900;
  }

  .roomlist-header button {
    font-family: sans-serif;
    font-size: 10px;
    background: orange;
    color: black;
    border-radius: 10px;
  }

  .room-queue {
    height: 150px;
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
    font-family: sans-serif;
    font-size: 50px;
    background: goldenrod;
    color: black;
    border-radius: 10px;
  }

  .done.hide {
    display: none;
  }

  .clear {
    font-family: sans-serif;
    font-size: 20px;
    margin-top: 20px;
    border-radius: 10px;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .backdrop {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .modal-content-wrapper {
    z-index: 10;
    max-width: 70vw;
    border-radius: 10px;
    background-color: white;
    overflow: hidden;
  }

  .modal-content {
    max-height: 50vh;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 200px;
    height: 100px;
    padding: 20px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  .modal-buttons {
    margin-top: 20px;
    display: flex;
    gap: 50px;
  }

  .modal-buttons button {
    font-size: 20px;
    border-radius: 10px;
  }
</style>