<script lang="ts">
  import type { Data } from '../_types/types';

  export let data: Data;

  let smallSet = [
    [10, 25],
    [20, 60],
    [30, 45],
    [40, 50],
    [45, 10],
    [50, 40],
  ];

  let height = 0;
  let width = 0;

  let minYvalue = 0;
  let maxYvalue = Math.max(...smallSet.map(point => point[1]));
  let minXvalue = Math.min(...smallSet.map(point => point[0]));
  let maxXvalue = Math.max(...smallSet.map(point => point[0]));

  let coords = smallSet.map(point => [0, 0]);

  $: if (width || height) {
    coords = smallSet.map(point => [(width * (point[0] - minXvalue) / (maxXvalue - minXvalue)), (height * (point[1] - minYvalue) / (maxYvalue - minYvalue))]);
  }
</script>

<figure bind:clientHeight={height} bind:clientWidth={width} style="--chart-height: 50vw; --chart-width: 50vw;">
  <ul>
    {#each coords as [x, y], i}
      <li>
        <div class="data-point" data-x={x} data-y={y} style="left: {x}px; bottom: {y}px;"/>
      </li>
    {/each}
  </ul>
</figure>

<style>
  figure {
    box-sizing: border-box;
    border-bottom: 1px solid black;
    border-left: 1px solid black;
    height: var(--chart-height);
    width: var(--chart-width);
    margin: 1rem auto;
    padding: 0;
    position: relative;
  }

  figure ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .data-point {
    background-color: blue;
    border-radius: 50%;
    height: 6px;
    width: 6px;
    position: absolute;
  }
</style>