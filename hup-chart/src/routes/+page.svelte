<script lang="ts">
  import Chart from './_components/chart.svelte';
  import { convertTime, getMs } from './_utils';
  import type { Point, Data } from './_types/types';

  let display = "data";
  let value = '';
  let rawData = [];
  let data: Data = {
    component: '',
    minimum: 0,
    maximum: 0,
    units: '',
    data: [],
  };

  const clearData = {...data};

  const emptyPoint: Point = {
    date: new Date(Date.now()),
    dateString: '',
    timeString: '',
    value: 0,
  }

  $: if (value) {
    data.data = [];
    rawData = value.split('\n');
    rawData.forEach((line: string) => {
      const parsedLine = line.split(/\s{3,}/).slice(0, -1);
      if (!parsedLine || !parsedLine[0]) return;
      if (parsedLine[0] === 'Component') {
        data.component = parsedLine[1];
      } else if (parsedLine[0].includes('Latest Ref')) {
        const limits = parsedLine[1].split(' ');
        data.minimum = parseFloat(limits[0]);
        data.maximum = parseFloat(limits[2]);
        data.units = limits[3];
      } else if (parsedLine.length === 3) {
        let point: Point = { ...emptyPoint };
        let hours = 12;
        let minutes = 0;
        let dateString = '';
        parsedLine.forEach((entry: string) => {
          if (entry.includes('/')) {
            dateString = entry;
            point.dateString = (new Date(entry)).toLocaleString('en-US', {
              'day': '2-digit',
              'month': '2-digit',
              'year': '2-digit',
            });
          }
          if (entry.includes(':')) {
            [hours, minutes] = convertTime(entry);
            const hr = hours < 10 ? `0${hours}` : `${hours}`;
            const min = minutes < 10 ? `0${minutes}` : `${minutes}`;
            point.timeString = `${hr}:${min}`;
          }
          if (entry.includes('.')) {
            point.value = parseFloat(entry);
          }
        });
        if (!point.timeString) point.timeString = '12:00';
        point.date = getMs(dateString, point.timeString);
        data.data = data.data.concat(point);
      }
    });
    data.data.sort((a: Point, b: Point) => {
      return a.date.getTime() - b.date.getTime() ;
    });
  };

  const handleClear = () => {
    value = '';
    rawData = [];
    data = clearData;
  };

</script>

{#if display === 'data'}
<div class="entry">
  <div class="left-column">
    <h1>HUP Chart</h1>
    <h2>Copy and paste data below:</h2>
    <textarea bind:value />
    {#if data.data.length > 0}
      <br />
      <button on:click={() => display = 'chart'}>GO TO CHART</button>
      <br />
      <button on:click={() => handleClear()}>CLEAR DATA</button>
    {/if}
  </div>
  <div class="right-column">
    <h1>Preview data</h1>
    <h2>Should look similar to the following:</h2>
    <ul class="sample">
      <li class="guide">-Component--Min--Max--Units</li>
      <li><b>Creatinine, 0.64-1.27 mg/dL</b></li>
      <li class="data">-Date------Time---Value</li>
      <li>12/19/2022, 14:35, 2.06</li>
      <li>12/19/2022, 19:40, 1.93</li>
      <li>12/20/2022, 02:17, 1.99</li>
      <li><i>etc.</i></li>
    </ul>
    {#if data.data.length > 0}
      <h2>Data (read-only):</h2>
      <ul class="data-wrapper">
        {#if data.data.length > 1}
          <li><b>{data.component}, {data.minimum}-{data.maximum} {data.units}</b></li>
          {#each data.data as {dateString, timeString, value}}
          <li>{dateString}, {timeString}, {value.toFixed(2)}</li>
          {/each}
        {:else}
          <li class="error">Error: Invalid Data Set</li>
        {/if}
      </ul>
    {/if}
  </div>
</div>
{:else if display === 'chart'}
  <div class="chart-wrapper">
    <button on:click={() => display = 'data'}>GO TO DATA</button>
    <Chart {data} />
  </div>
{/if}

<style>
  .entry {
    display: flex;
    gap: 5%;
  }

  h1,
  h2 {
    font-family:Arial, Helvetica, sans-serif;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }
  li {
    font-family:'Courier New', Courier, monospace;
  }

  li i {
    opacity: 0.5;
  }

  textarea {
    width: 40vw;
    height: 60vh;
    background: #fffff4;
    border: 3px double black;
    border-radius: 6px;
    resize: none;
  }

  .sample {
    border-left: 3px double black;
    border-top: 3px double black;
    border-radius: 6px 0 0 0;
    width: 20rem;
    padding: 0.5rem;
  }

  .data-wrapper {
    background: #f4f4ff;
    border: 3px double black;
    border-radius: 6px;
    height: 26.3rem;
    overflow: scroll;
    padding: 0.5rem;
  }

  .guide,
  .data {
    color: red;
    font-style: italic;
  }

  .data,
  .data-wrapper :nth-child(2) {
    margin-top: 1rem;
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-size: 2rem;
  }

  button:hover {
    opacity: 0.7;
  }

  .error {
    color: darkred;
    font-weight: 900;
  }
</style>

