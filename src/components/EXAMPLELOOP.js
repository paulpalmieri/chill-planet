import React, { useState, useEffect, useReducer, useRef } from "react";

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
      console.log(" Bought");
    }
  },
  {
    name: "Wood automation",
    description: "Automates wood collecting",
    cost: 50,
    action: function() {
      console.log(" Bought");
    }
  }
];

export default function GameV2() {
 
  const [time, setTime] = React.useState(Date.now());
  // start gameloop once at mount time
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(Date.now);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const delta = (1000 - (Date.now() - time) / 1000);
    do_tick(delta);
  }, [time]);

  return (
    <MainContainer>
      <TopContainer>
        <span>${cash}</span>
      </TopContainer>
      <MiddleContainer>
        <UpgradesContainer>
          {upgrades.map((e, index) => (
            <Button onClick={() => buy_upgrade(index)}>{e.name}</Button>
          ))}
        </UpgradesContainer>
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
