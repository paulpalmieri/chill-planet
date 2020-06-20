import React, { useState, useEffect } from "react";

import { resources } from "./data/all";

import ResourceContainer from "./ResourceContainer";
import styled from "styled-components";
import { Button } from "react-bootstrap";

const MainContainer = styled.div`
  font-family: "Poppins";
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  width: 100%;
`;
const TopContainer = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  color: #00bd35;
  /* margin-bottom: 100px; */
`;

const MiddleContainer = styled.div`
  display: flex;
  flex-direction: row;
  /* align-content: center; */
  justify-content: center;
  width: 100%;
`;

const ResourcesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 48%;
`;

const UpgradesContainer = styled.div`
  border: 1px solid lightgrey;
  width: 24%;
  margin: 0;
`;
const MarketContainer = styled.div`
  border: 1px solid lightgrey;
  width: 24%;
  margin: 0;
`;

const BottomContainer = styled.div`
  height: 80px;
`;
const INITAL_CASH = 0;

const upgradesInitial = [
  {
    name: "Wood automation",
    description: "Automates wood collecting",
    cost: 50,
    action: function() {
      console.log(' Bought')
    }
  },
  {
    name: "Wood automation",
    description: "Automates wood collecting",
    cost: 50,
    action: function() {
      console.log(' Bought')
    }
  },
];

export default function GameV2() {
  const [cash, setCash] = useState(INITAL_CASH);
  // RESOURCES
  const [buildings, setBuildings] = useState(resources);
  // UPGRADES
  const [upgrades, setUpgrades] = useState([{
    name: "Wood automation",
    description: "Automates wood collecting",
    cost: 50,
    action: function(id) {
      automate_resource(id);
    }
  },
  {
    name: "Gold automation",
    description: "Automates gold collecting",
    cost: 250,
    action: function(id) {
      automate_resource(id);
    }
  }]);

  // init a 0 filled array to store progress bar values
  const [progressBars, setProgressBars] = useState(
    new Array(buildings.length).fill(0)
  );

  

  let previous_timestamp = 0;
  let partial_ticks = 0;
  let update_rate = 1000 / 30;
  let progressCopy = [0, 0];

  function gameLoop(timestamp) {
    let time_difference = timestamp - previous_timestamp;
    previous_timestamp = timestamp;
    partial_ticks += time_difference;

    // periodically compute state changes/progress
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

          let buildingsCopy = [...buildings];
          setCash(cash => cash + e.income);
          progressCopy[index] = 0;

          if (e.automated) {
            buildingsCopy[index].last_clicked = performance.now();
            buildingsCopy[index].canStart = false;
          } else {
            buildingsCopy[index].canStart = true;
          }
          setBuildings(buildingsCopy);
        }
      });
    }

    // Periodically set state
    if (partial_ticks > update_rate) {
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
      partial_ticks -= update_rate;
    } else {
      partial_ticks++;
    }

    requestAnimationFrame(gameLoop);
  }

  // debug button to scale the speed of all buildings
  function scaleSpeedUp() {
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
  // debug button to scale the speed of all buildings
  function scaleSpeedDown() {
    let buildingsCopy = [...buildings];
    buildings.forEach((e, index) => {
      if (e.time < 1000) {
        e.time += 1000;
      } else {
        e.time += 500;
      }
    });

    setBuildings(buildingsCopy);
  }

  function setSpeed(value) {
    let buildingsCopy = [...buildings];
    buildings.forEach((e, index) => {
      e.time = value;
    });

    setBuildings(buildingsCopy);
  }

  // modify the building state to add a timestamp and remove the button temporarily (for ever if automated)
  function handleProgressClick(id) {
    console.log("Progress clicking for ID:", id);
    let buildingsCopy = [...buildings];
    buildingsCopy[id].canStart = false;
    buildingsCopy[id].last_clicked = performance.now();
    setBuildings(buildingsCopy);
  }

  function automate_resource(id) {
    let buildingsCopy = [...buildings];
    buildingsCopy[id].canStart = false;
    buildingsCopy[id].automated = true;
    setBuildings(buildingsCopy);
  }

  function buy_upgrade(index) {
    // modify upgrade state to buy upgrade and execute function
    let upgradesCopy = [...upgrades];
    console.log(upgradesCopy[index]);
    upgradesCopy[index].action(index); // here it is automate_resource also defined 
  }

  // start gameloop once at mount time
  useEffect(() => {
    console.log("Starting gameloop...");
    let anim = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(anim);
  }, []); // don't listen to state changes

  return (
    <MainContainer>
      <TopContainer>
        <span>${cash}</span>
      </TopContainer>
      <MiddleContainer>
        <UpgradesContainer>{upgrades.map((e, index) => (
            <Button onClick={() => buy_upgrade(index)}>{e.name}</Button>
          ))}</UpgradesContainer>
        <ResourcesContainer>
          {buildings.map((e, index) => (
            <ResourceContainer
              id={index}
              name={e.name}
              value={progressBars[index]}
              time_left={e.time_left}
              time={e.time}
              can_start={e.canStart}
              income={e.income}
              handleClick={handleProgressClick}
              icon={e.icon}
              color={e.color}
              automated={e.automated}
            ></ResourceContainer>
          ))}
        </ResourcesContainer>
        <MarketContainer>Market</MarketContainer>
      </MiddleContainer>
      <BottomContainer>
        <Button className="w-25" onClick={scaleSpeedUp}>
          Scale speed +{" "}
        </Button>
        <Button className="w-25" onClick={scaleSpeedDown}>
          Scale speed -{" "}
        </Button>
        <Button className="w-25" onClick={() => setSpeed(1000)}>
          Scale speed to 1000{" "}
        </Button>
      </BottomContainer>
    </MainContainer>
  );
}
