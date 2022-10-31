<script>
  export let clefSign = 0;
</script>

{#if clefSign === 0}
  <img id="treble-clef" src="/images/treble-clef.svg" alt="" />
{/if}
{#if clefSign === 1}
  <img id="bass-clef" src="/images/bass-clef.svg" alt="" />
{/if}
{#if clefSign === 2}
  <img id="alto-clef" src="/images/c-clef.svg" alt="" />
{/if}
{#if clefSign === 3}
  <img id="tenor-clef" src="/images/c-clef.svg" alt="" />
{/if}

<style>
  #treble-clef {
    position: absolute;
    width: 6%;
    top: -2.4vw;
    left: 21%;
  }

  #bass-clef {
    position: absolute;
    width: 7%;
    top: 0.2vw;
    left: 21%;
  }

  #alto-clef {
    position: absolute;
    width: 7%;
    top: 0.2vw;
    left: 21%;
  }

  #tenor-clef {
    position: absolute;
    width: 7%;
    top: -2.2vw;
    left: 21%;
  }
</style>