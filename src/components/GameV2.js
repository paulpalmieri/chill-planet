import React, { useState, useEffect, useReducer, useRef } from "react";

import { Progress } from "semantic-ui-react";
import { request } from "https";

import { CircularProgressbar,buildStyles  } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { Button, ProgressBar } from "react-bootstrap";

const INITAL_CASH = 0;

const initialBuildings = [
  {
    name: "misc 1",
    income: 5,
    time: 2500,
    last_clicked: null,
    canStart: true,
    time_left: null,
    automated: false
  },
  {
    name: "misc 2",
    income: 20,
    time: 5000,
    last_clicked: null,
    canStart: true,
    time_left: null,
    automated: true
  },
  {
    name: "misc 3",
    income: 100,
    time: 10000,
    last_clicked: null,
    canStart: true,
    time_left: null,
    automated: true
  },
  {
    name: "misc 4",
    income: 200,
    time: 20000,
    last_clicked: null,
    canStart: true,
    time_left: null,
    automated: true
  },
  {
    name: "misc 5",
    income: 500,
    time: 30000,
    last_clicked: null,
    canStart: true,
    time_left: null,
    automated: true
  },
  {
    name: "misc 6",
    income: 50000,
    time: 60000,
    last_clicked: null,
    canStart: true,
    time_left: null,
    automated: true
  }
];

const initProgressBarState = () => {};

export default function GameV2() {
  const [cash, setCash] = useState(INITAL_CASH);
  const [buildings, setBuildings] = useState(initialBuildings);

  const [progressBars, setProgressBars] = useState(
    new Array(buildings.length).fill(0)
  );

  let counter = 0;
  let previous_timestamp = 0;
  let total_time = 0;
  let partial_ticks = 0;
  let update_rate = 20;
  let progressCopy = [0, 0];

  function gameLoop(timestamp) {
    let time_difference = timestamp - previous_timestamp;
    previous_timestamp = timestamp;
    total_time += time_difference;
    partial_ticks += time_difference;

    if (partial_ticks > update_rate) {
      buildings.forEach((e, index) => {
        const difference = timestamp - e.last_clicked;
        if (difference < e.time && !e.canStart) {
          // console.log(
          //   `Should update ${e.name} because time diff ${difference} < ${e.time}`
          // );

          console.log(`Updating to ${Math.ceil((difference * 100) / e.time)}`);
          // console.log(`Diff: ${difference}, time: ${e.time} `);

          progressCopy[index] = Math.ceil((difference * 100) / e.time);
        } else if (difference > e.time && !e.canStart) {
          // console.log(
          //   `Should not update building because time diff ${difference} > ${e.time} `
          // );

          if (e.automated) {
            progressCopy[index] = 0;
            setCash(cash => cash + e.income);
            let buildingsCopy = [...buildings];
            buildingsCopy[index].last_clicked = performance.now();
            buildingsCopy[index].canStart = false;
            setBuildings(buildingsCopy);
          } else {
            console.log("resetting: " + e.name);
            progressCopy[index] = 0;
            let buildingsCopy = [...buildings];
            buildingsCopy[index].canStart = true;
            setBuildings(buildingsCopy);
            setCash(cash => cash + e.income);
          }
        }
      });
    }

    // set state periodically
    if (partial_ticks > update_rate) {
      // console.log(
      //   `😂😂😂😂😂😂😂 to ${progressCopy} because ${partial_ticks} > ${update_rate}`
      // );
      let buildingsCopy = [...buildings];
      buildingsCopy.forEach((e, index) => {
        if (!e.canStart) {
          const difference = timestamp - e.last_clicked;
          buildingsCopy[index].time_left = e.time - difference;
        } else {
          buildingsCopy[index].time_left = 0;
        }
      });

      setBuildings(buildingsCopy);
      console.log(`😂`);
      setProgressBars([...progressCopy]);
      // resetProgress();
      partial_ticks = 0;
    } else {
      partial_ticks++;
    }

    counter += 1;

    // let anim = requestAnimationFrame(gameLoop);
    requestAnimationFrame(gameLoop);
  }

  function scaleSpeed() {
    let buildingsCopy = [...buildings];
    buildings.forEach((e, index) => {
      if (e.time > 800) {
        e.time -= 800;
      } else if (e.time > 100) {
        e.time -= 100;
      }
    });

    setBuildings(buildingsCopy);
  }

  // modify the building state to add a timestamp and remove the button temporarily
  function handleProgressClick(id) {
    let buildingsCopy = [...buildings];
    buildingsCopy[id].canStart = false;
    buildingsCopy[id].last_clicked = performance.now();
    setBuildings(buildingsCopy);
  }

  // start gameloop once at mount time
  useEffect(() => {
    console.log("Starting gameloop...");
    let anim = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(anim);
  }, []); // retrigger function call when the state value changes

  return (
    <div className="container mt-4">
      <span>Cash: {cash}</span>
      <div className="all-progress-container">
      {buildings.map((e, index) => (
        <div key={index} className="progress-container m-2 w-25 h-25">
          
          <span>{Math.round(e.income / (e.time/1000)) }/s</span>
          {/* <ProgressBar
            className="m-2 w-100"
            now={progressBars[index]}
            animated
            variant="success"
            label={`${Math.ceil(e.time_left / 1000)}s`}
          /> */}
          <CircularProgressbar
            className="w-100"
            value={progressBars[index]}
            text={`${Math.ceil(e.time_left / 1000)}s, ${Math.ceil(e.time_left*100 / e.time) == 0 ? 0 :  100 - Math.ceil(e.time_left*100 / e.time)}%`}
            styles={buildStyles({
              // Rotation of path and trail, in number of turns (0-1)

              // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'

              // Text size
              textSize: "14px",

              // How long animation takes to go from one percentage to another, in seconds
              pathTransition: 'stroke-dashoffset 0.1s ease 0s',
            })}
          />
          {e.canStart ? (
            <Button
              className="fade-in m-2"
              onClick={() => handleProgressClick(index)}
            >
              ${e.income} in {e.time/1000}s
            </Button>
          ) : (
            ""
          )}
        </div>
      ))}
      </div>

      <button onClick={scaleSpeed}>Scale speed + </button>
    </div>
  );
}


