<script lang="ts">
  import { orderOfSharps, clefs } from '../routes/_consts';
  import { fade } from 'svelte/transition';
  export let keySig = 0;
  export let clefSign = 0;
  let accidentals = Array(keySig);
  let signature: any = [];
  $: if (keySig !== 0) {
    for (let i = Math.sign(keySig); Math.abs(i) <= Math.abs(keySig); i+= Math.sign(keySig)) {
      signature.push([Math.sign(keySig) === 1 ? 'sharp' : 'flat', clefs[clefSign], orderOfSharps[i - 1 + 8 * Number(i < 0)]]);
    }
  } else {signature = []}

</script>

{#each signature as [accidental, clef, name], i}
  <img bind:this={accidentals[i]} class={accidental} id={`${clef}-${name}-${accidental}`} src={`/images/${accidental}.svg`} class:invisible={Math.abs(keySig) < (i + 1)} style={`left:${28 + 2.25 * i}vw`} alt="" transition:fade />
{/each}

<style>
  .sharp,
  .flat {
    width: 2vw;
    position: absolute;
  }

  .invisible {
    display: none;
  }

  #treble-F-sharp {
    left: 28vw;
    top: -3vw;
  }

  #treble-C-sharp {
    left: 30.25vw;
    top: 0.65vw;
  }

  #treble-G-sharp {
    left: 32.5vw;
    top: -4.1vw;
  }

  #treble-D-sharp {
    left: 34.75vw;
    top: -0.5vw;
  }

  #treble-A-sharp {
    left: 37vw;
    top: 3.1vw;
  }

  #treble-E-sharp {
    left: 39.25vw;
    top: -1.7vw;
  }

  #treble-B-sharp {
    left: 41.5vw;
    top: 1.85vw;
  }

  #treble-B-flat {
    left: 28vw;
    top: 1.85vw;
  }

  #treble-E-flat {
    left: 30.25vw;
    top: -1.7vw;
  }

  #treble-A-flat {
    left: 32.5vw;
    top: 3.1vw;
  }

  #treble-D-flat {
    left: 34.75vw;
    top: -0.5vw;
  }

  #treble-G-flat {
    left: 37vw;
    top: 4.25vw;
  }

  #treble-C-flat {
    left: 39.25vw;
    top: 0.65vw;
  }

  #treble-F-flat {
    left: 41.5vw;
    top: 5.4vw;
  }
</style>