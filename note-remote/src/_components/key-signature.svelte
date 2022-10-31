<script lang="ts">
  import { orderOfSharps, clefs } from '../routes/_consts';
  import { fade } from 'svelte/transition';
  export let keySig = 0;
  export let clefSign = 0;
  let accidentals = Array(Math.abs(keySig));
  const getOffsets = (keySig: number, clefSign: number) => {
    const offsets = [];
    for (let i = 0; Math.abs(i) < Math.abs(keySig); i+= Math.sign(keySig)) {
      offsets[Math.abs(i)] = 5.4 - 2.375 * (clefSign + Math.sign(keySig) + (2.5 - 2 * clefSign) * Number(clefSign < 2) + (i / 4) - (Math.sign(keySig) * 1.75 * (Math.abs(i) % 2)) - 3.5 * (Number(clefSign === 3) * Number (i === 0 || i === 2) * Number(keySig > 0) + Number(i > 3 && (i % 2 === 0))));
    }
    return offsets;
  }
  let signature: any = [];
  $: if (keySig !== 0) {
    for (let i = Math.sign(keySig); Math.abs(i) <= Math.abs(keySig); i+= Math.sign(keySig)) {
      signature.push([Math.sign(keySig) === 1 ? 'sharp' : 'flat', clefs[clefSign], orderOfSharps[i - 1 + 8 * Number(i < 0)], getOffsets(keySig, clefSign)[Math.abs(i) - 1]]);
    }
  } else {signature = []}

</script>

{#each signature as [accidental, clef, name, offset], i (clef+name+accidental)}
  <img bind:this={accidentals[i]} class={accidental} id={`${clef}-${name}-${accidental}`} src={`/images/${accidental}.svg`} class:invisible={Math.abs(keySig) < (i + 1)} style={`left:${28 + 2.25 * i}vw;top:${offset}vw;` } alt="" transition:fade />
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
</style>