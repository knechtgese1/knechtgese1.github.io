<script lang="ts">
  import type { Data } from '../_types/types';

  export let data: Data;

  $: if (data) {
    console.log(data);
  }

  let dataSet = data.data.map(point => [point.date, point.value]);

  let height = 0;
  let width = 0;

  let minYvalue = 0;
  let maxYvalue = Math.max(...dataSet.map(point => point[1]));
  let minXvalue = Math.min(...dataSet.map(point => point[0]));
  let maxXvalue = Math.max(...dataSet.map(point => point[0]));

  let coords = dataSet.map(() => [0, 0]);
  let hypotenuses = dataSet.map(() => 0);
  let angles = dataSet.map(() => 0);
  let hovered = dataSet.map(() => false);

  const getTooltip = (i: number) => {
    return [data.data[i].dateString + '\u00A0' + data.data[i].timeString, data.data[i].value + (data.units || '')];
  }

  $: if (width || height) {
    coords = dataSet.map(point => [(width * (point[0] - minXvalue) / (maxXvalue - minXvalue)), (height * (point[1] - minYvalue) / (maxYvalue - minYvalue))]);
    hypotenuses = coords.map((point, index, points) => 
      index + 1 === points.length ? 0 : Math.sqrt(Math.pow(points[index + 1][0] - point[0], 2) + Math.pow(points[index + 1][1] - point[1], 2))
    );
    angles = coords.map((point, index, points) => 
      index + 1 === points.length ? 0 : ((Math.asin((points[index + 1][0] - point[0]) / hypotenuses[index]) * 180 / Math.PI) - 90) * Math.sign(points[index + 1][1] - point[1])
    );
  }
</script>

<figure bind:clientHeight={height} bind:clientWidth={width} style="--chart-height: 50vw; --chart-width: 50vw;">
  <ul>
    {#each coords as [x, y], i}
      <li style="--y: {y}px; --x: {x}px;">
        <div class="line-segment" style="--hypotenuse: {hypotenuses[i]}; --angle: {angles[i]}" />
        <div class="data-point" data-x={dataSet[i][0]} data-y={dataSet[i][1]} on:mouseenter={() => hovered[i] = true} on:mouseleave={() => hovered[i] = false}/>
        <div class="tooltip" class:hovered={hovered[i]}>
          {getTooltip(i)[0]}<br>
          {getTooltip(i)[1]}
        </div>
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
    bottom: calc(var(--y) - 2px);
    left: calc(var(--x) - 3px);
  }

  .tooltip {
    font-family:Arial, Helvetica, sans-serif;
    font-size: 1rem;
    font-weight: 900;
    z-index: 1;
    position: relative;
    bottom: 1.25rem;
    color: darkred;
    background: lightgrey;
    padding: 3px;
    opacity: 0.75;
    position: absolute;
    bottom: calc(var(--y) + 5px);
    left: calc(var(--x) - 1px);
    display: none;
  }

  .tooltip.hovered {
    display: block;
  }

  .data-point:hover {
    height: 10px;
    width: 10px;
    bottom: calc(var(--y) - 4px);
    left: calc(var(--x) - 5px);
  }

  .line-segment {
    background-color: #888888;
    bottom: var(--y);
    height: 1px;
    left: var(--x);
    position: absolute;
    width: calc(var(--hypotenuse) * 1px);
    transform: rotate(calc(var(--angle) * 1deg));
    transform-origin: left bottom;
  }
</style>