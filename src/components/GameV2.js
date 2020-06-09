import React, { useState, useEffect, useReducer, useRef } from "react";

import { Progress } from "semantic-ui-react";
import { request } from "https";

import { ProgressBar } from "react-bootstrap";

const INITAL_CASH = 0;

const buildingsList = [
  {
    name: "BUILDING 1",
    cost: 100,
    owned: 0,
    income: 1
  },
  {
    name: "Beer",
    cost: 1000,
    owned: 0,
    income: 5
  }
];

const initialBuildings = [
  {
    name: "Lemon stand",
    income: 5,
    time: 5000,
    last_clicked: null,
    canStart: true
  },
  {
    name: "Car wash",
    income: 10,
    time: 9000,
    last_clicked: null,
    canStart: true
  }
];

export default function GameV2() {
  const [cashNum, setCashNum] = useState(INITAL_CASH);
  const [progress1, setProgress1] = useState(0);
  const [buildings, setBuildings] = useState(initialBuildings);

  const [progressBars, setProgressBars] = useState([0, 0]);

  const progressRef = useRef(null);

  let counter = 0;
  let previous_timestamp = 0;
  let total_time = 0;
  let partial_ticks = 0;
  let update_rate = 250;

  // // receives a timestamp each call
  // function updateProgress1(timestamp, threshold) {
  //     console.log(timestamp);
  //     let time_difference = previous_timestamp? timestamp - previous_timestamp : tick_duration;
  //     previous_timestamp = timestamp;
  //     total_time += time_difference;
  //     partial_ticks += time_difference;
  //     console.log(`Threshold: ${threshold}`)
  //     // console.log(`Time difference: ${time_difference}`)
  //     // console.log(`Partial ticks: ${partial_ticks}`)

  //     if(partial_ticks > 100) {
  //         // only set state every 100 ms
  //         console.log('setting state');
  //         setProgress1(progress1 => progress1 + (100 * partial_ticks / time_treshold));
  //         partial_ticks = 0;
  //     }

  //     // setProgress1(100 * total_time / time_treshold);

  //     // update based on timestamp

  //     let test1 = requestAnimationFrame(updateProgress1);
  //     if(total_time > time_treshold) {
  //         setProgress1(100);

  //         console.log(total_time);
  //         cancelAnimationFrame(test1);

  //         setTimeout(function() {
  //             setProgress1(0);
  //         }, 500);
  //         // remove animation frame
  //     }
  // }

  let progressCopy = [0, 0];
  function gameLoop(timestamp) {
    let time_difference = timestamp - previous_timestamp;
    previous_timestamp = timestamp;
    total_time += time_difference;
    partial_ticks += time_difference;

    buildings.forEach((e, index) => {
      const difference = timestamp - e.last_clicked;
      if (difference < e.time && !e.canStart) {
        console.log(
          `Should update ${e.name} because time diff ${difference} < ${e.time}`
        );
        progressCopy[index] = (difference * 100) / e.time;
      } else if (difference > e.time && !e.canStart) {
        console.log(
          `Should not update building because time diff ${difference} > ${e.time} `
        );
        progressCopy[index] = 0;
        let buildingsCopy = [...buildings];
        buildingsCopy[index].canStart = true;    
        setBuildings(buildingsCopy);
      } 
    });

    // set state periodically
    if (partial_ticks > update_rate) {
      console.log(
        `😂😂😂😂😂😂😂 to ${progressCopy} because ${partial_ticks} > ${update_rate}`
      );
      



      setProgressBars([...progressCopy]);
      partial_ticks = 0;
    } else {
      partial_ticks++;
    }

    counter += 1;

    // let anim = requestAnimationFrame(gameLoop);
    requestAnimationFrame(gameLoop);
  }

  function getUpdateProgress(
    id,
    threshold,
    update_rate,
    previous_timestamp,
    partial_ticks,
    total_time
  ) {
    const updateProgress = timestamp => {
      console.log(`------------------------`);
      // console.log(`Initial TS: ${initial_timestamp}`)
      console.log(`Timestamp since first raF: ${timestamp}`);

      // console.log(`Time Threshold: ${threshold}`)
      // console.log(`Update freq: ${update_rate}`)
      let time_difference = timestamp - previous_timestamp;
      console.log(`Time diff between f-calls: ${time_difference}`);
      previous_timestamp = timestamp;
      total_time += time_difference;

      partial_ticks += time_difference;

      if (partial_ticks > update_rate) {
        // only set state every 100 ms
        console.log(`OOOOOOOOOOOOO setting ticks ${partial_ticks}`);
        let progressCopy = { ...progressBars };
        progressCopy[id] = progressCopy[id] + (100 * partial_ticks) / threshold;
        // setProgressBars(progressCopy);
        console.log(progressRef);
        // progressRef.curKC += (100 *  partial_ticks / threshold);
        partial_ticks = 0;
      }

      let anim = requestAnimationFrame(updateProgress);
      if (total_time > threshold) {
        // total_time = 0;
        console.log(`Done. Time: ${total_time}`);
        total_time = 0;
        let progressCopy = { ...progressBars };
        progressCopy[id] = 100;
        setProgressBars(progressCopy);

        cancelAnimationFrame(anim);
        setTimeout(function() {
          let progressCopy = { ...progressBars };
          progressCopy[id] = 0;
          setProgressBars(progressCopy);
          console.log("reseting to 0");
        }, 500);
      }
    };
    return updateProgress;
  }

  function handleClick(id) {
    // on progress bar click:
    // start the progress bar, update value every 250ms to get some animation
    // at the end, clear the bar.

    let buildingsCopy = [...buildings];
    buildingsCopy[id].canStart = false;
    buildingsCopy[id].last_clicked = performance.now();

    setBuildings(buildingsCopy);

    // setProgressBars([30, 50])
    // const initial_timestamp = performance.now();
    // const updateFunc = getUpdateProgress(id, 5000, 1000, initial_timestamp, 0, 0);
    // requestAnimationFrame(updateFunc);
  }

  useEffect(() => {
    console.log("Starting gameloop...");
    let anim = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(anim);
  }, []); // retrigger function call when the state value changes

  return (
    <div>
      {buildings.map((e, index) => (
        <div key={index}>
          {/* <span>{e.name}</span> */}
          <ProgressBar
            now={progressBars[index]}
            animated
            label={`Now: ${progressBars[index]}%`}
          />

          {e.canStart ? (
            <button onClick={() => handleClick(index)}>
              Increment {e.name}
            </button>
          ) : (
            ""
          )}
          <button onClick={() => handleClick(index)}>Increment {e.name}</button>
          {/* <button onClick={() => handleClick(index)}>Increment {e.name}</button> */}
        </div>
      ))}

      {/* <ProgressBar ref={progressRef} now={50} animated label={`Now: ${progress1}%`}/>
        <ProgressBar  now={progressBars[0]} animated label={`Now: ${progressBars[0]}%`}/>
        <ProgressBar  now={progressBars[1]} animated label={`Now: ${progressBars[1]}%`}/>


        {/* <Progress percent={progress1} indicating /> */}
      {/* <button onClick={handleClick}>Increment</button>
        <button onClick={() => handleClick(0)}>Increment 0</button>
        <button onClick={() => handleClick(1)}>Increment 1</button> */}
    </div>
  );
}
