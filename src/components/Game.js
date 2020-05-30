import React, { useState, useEffect, useReducer } from "react";

import BuildingCard from "./BuildingCard";

import styled from "styled-components";

const TICK_RATE = 1000 / 15;
const CHILL_TARGET = 7e9;
const INITAL_CHILL = 0;
const INITAL_CASH = 350;

const GameContainer = styled.div`
  font-size: 34px;
  height: 600px;
  margin: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const buildingsList = [
  {
    name: "Tea",
    cost: 100,
    owned: 0,
    income: 1
  },
  {
    name: "Beer",
    cost: 1000,
    owned: 0,
    income: 5
  },
  {
    name: "Weed",
    cost: 10000,
    owned: 0,
    income: 15
  },
  {
    name: "Vodka",
    cost: 100000,
    owned: 0,
    income: 30
  },
  {
    name: "Cocktail",
    cost: 1000000,
    owned: 0,
    income: 60
  }
];

export default function Game() {
  const [chillCount, setChillCount] = useState(INITAL_CHILL);
  const [cashNum, setCashNum] = useState(INITAL_CASH);
  const [buildingsState, setBuilding] = useState(buildingsList);
  const [chillRate, setChillRate] = useState(1);

  const increaseChillRate = () => {
    setChillRate(chillRate => chillRate + 10);
  };

  const updateChillCount = () => {
    setChillCount(chillCount => chillCount + chillRate);
  };

  const getCostForMultiBuy = (id, amount) => {
        // todo: get value after summing 10 cost increases.
        // ex: 100 + 102 + 104 + 106 to buy 4 items
  };

  function updateCashCount() {
    let cashIncrease = 0;
    buildingsState.forEach(element => {
      cashIncrease += element.owned * element.income;
    });
    setCashNum(cashNum => cashNum + cashIncrease);
  }

  function handleBuyBuilding(id) {
    if (cashNum > buildingsState[id].cost) {
      console.log(`Buying 1 of building ${id}`);
      const buildingsCopy = [...buildingsState];
      buildingsCopy[id].owned += 1;

      setCashNum(cashNum => cashNum - buildingsState[id].cost);

      let costIncrease = Math.ceil(Math.pow(1.07, buildingsCopy[id].owned));
      buildingsCopy[id].cost += costIncrease;

      setBuilding(buildingsCopy);
    } else {
      console.log(`Noth enough cash to buy 1 of building ${id}`);
    }
  }

  useEffect(() => {
    const interval = setTimeout(updateCashCount, TICK_RATE);

    return () => clearInterval(interval);
  }, [cashNum]); // retrigger function call when the state value changes

  useEffect(() => {
    const interval = setTimeout(updateChillCount, TICK_RATE);

    return () => clearInterval(interval);
  }, [chillCount]); // retrigger function call when the state value changes

  return (
    <GameContainer className="main">
      <h1 className="text-primary">
        Ca chill sec: {chillCount} / {CHILL_TARGET}
      </h1>
      <h1 className="text-success">${cashNum}</h1>
      <button className="btn btn-warning" onClick={increaseChillRate}>
        Increase chill rate from {chillRate} to {chillRate + 10}
      </button>
      <div className="w-50">
        {buildingsState.map((e, index) => (
          <BuildingCard
            id={index}
            name={e.name}
            owned={e.owned}
            cost={e.cost}
            buyBuilding={handleBuyBuilding}
            warning={!(cashNum > e.cost)}
          ></BuildingCard>
        ))}
      </div>
    </GameContainer>
  );
}
