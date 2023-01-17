<script lang="ts">
  let note: any;
  import { Clef, Ledger, KeySig } from '../_components';
  let choices = ['D4', 'A4'];
  let clefSign = 0;
  let staffPosition = -1; // 0 = bottom space; +/- 0.5 for each line/space
  let keySig = 2;
  $: if (note) note.style.bottom = (-9.75 + 2.35 * staffPosition - 6.45 * Number(staffPosition > 1)) + 'vw';
</script>

<div id="note-remote">
  <img id="logo" src="/images/FASE.png" alt="Foundation for the Advancement of String Education"/>

  <img id="settings" src="/images/settings-gear.png" alt="Settings" />
  
  <div id="staff-container">
    <img id="staff" src="/images/staff-lines.svg" alt="">
      <Clef {clefSign} />
      <KeySig {clefSign} {keySig} />
    <img bind:this={note} id="note" src="/images/quarter-note.svg" alt="" class:invert={staffPosition > 1}>
      <Ledger {staffPosition} />
  </div>

  <div id="buttons-container">
    <button>D</button>
    <button>A</button>
  </div>
</div>

<style>
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    src: url('/fonts/Poppins/Poppins-Black.ttf') format('truetype');
  }

  #note-remote {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #logo {
    position: fixed;
    top: 5px;
    left: 5px;
    height: 6vw;
  }

  #settings {
    position: fixed;
    top: 5px;
    right: 5px;
    height: 6vw;
  }

  #staff-container {
    position: relative;
    margin-top: 12vw;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  #staff {
    position: absolute;
    width: 60%;
    height: 10vw;
  }

  #note {
    /* default position is treble clef A */
    position: absolute;
    width: 3%;
    height: 9vw;
    transition: all 0.5s ease-in-out;
  }

  .invert {
    transform: rotate(180deg);
  }

  #buttons-container {
    position: relative;
    top: 18vw;
    width: 50%;
    display: flex;
    justify-content: space-evenly;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5px;
  }

  #buttons-container button {
    border-radius: 1vw;
    border-width: 3px;
    border-style: outset;
    width: 5vw;
    height: 5vw;
    font-family: 'Poppins';
    font-size: 2.5vw;
    color: white;
  }

  #buttons-container button:hover {
    filter: drop-shadow(5px 5px 0.5vw #888);
  }

  #buttons-container button:active {
    background-color: black;
  }
</style>