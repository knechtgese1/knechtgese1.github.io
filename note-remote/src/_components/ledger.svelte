<script>
  export let staffPosition = 0;
  import { fade } from 'svelte/transition';
</script>


{#if staffPosition < -1}
  <div class="ledger minus-1" transition:fade/>
{/if}
{#if staffPosition < -2}
  <div class="ledger minus-2" transition:fade/>
{/if}
{#if staffPosition > 4}
  <div class="ledger plus-1" transition:fade/>
{/if}
{#if staffPosition > 5}
  <div class="ledger plus-2" transition:fade/>
{/if}

<style>
  .ledger {
    position: absolute;
    height: 0.45vw;
    width: 5vw;
    background-color: black;
  }

  .minus-1 {
    top: 11.75vw;
  }

  .minus-2 {
    top: 14.1vw;
  }

  .plus-1 {
    top: -2.35vw;
  }

  .plus-2 {
    top: -4.7vw;
  }
</style>