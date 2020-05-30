
import React, { useState, useEffect, useReducer } from "react";

import workerRoutine from './worker.js';
import WebWorker from './WebWorker';


import BuildingCard from "./BuildingCard";

import styled from "styled-components";

const TICK_RATE = 15;
const CHILL_TARGET = 7e9;
const INITAL_CHILL = 0;
const INITAL_CASH = 1000000;

console.log(workerRoutine);


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
    income: 1,
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
];

export default function Game() {
  const [chillCount, setChillCount] = useState(INITAL_CHILL);
  const [cashNum, setCashNum] = useState(INITAL_CASH);
  const [buildingsState, setBuilding] = useState(buildingsList);
  const [chillRate, setChillRate] = useState(1/66);
  const [cashRate, setCashRate] = useState(0);
  const [buildingsOwned, setBuildingsOwned] = useState(0);

  const increaseChillRate = () => {
    setChillRate(chillRate => chillRate + 0.1);
  };
  const decreaseChillRate = () => {
    if(chillRate > 0.1) setChillRate(chillRate => chillRate - 0.1);
  };

  const updateChillCount = () => {
    setChillCount(chillCount => chillCount + chillRate);
  };

  function updateBuildingPrice(id) {
    const buildingsStateCopy = [...buildingsState];
    buildingsStateCopy[id].cost_10 = getCostForMultiBuy(id, 10);
    buildingsStateCopy[id].cost_100 = getCostForMultiBuy(id, 100);
    setBuilding(buildingsStateCopy);

    // buildingsStateCopy.forEach((element, index) => {
    //   element.cost_10 = getCostForMultiBuy(index, 10);
    //   element.cost_100 = getCostForMultiBuy(index, 100);
    //   console.log(element);
    // });

  };

  const getCostForMultiBuy = (id, amount) => {

        if(amount === 1) return buildingsState[id].cost;
        if(amount === 2) return buildingsState[id].cost*2 + Math.ceil(Math.pow(1.07, buildingsState[id].owned));

        let total = 0;
        let curCost = buildingsState[id].cost; // buy 1
        let nextCost = curCost + Math.ceil(Math.pow(1.07, buildingsState[id].owned)); // buy a second

        total += curCost + nextCost; // bought 2

        let tmpCount = 2;

        for(let i = 0; i < amount - 2; i++) {
          console.log('buying');
          curCost = nextCost;
          nextCost = curCost + Math.ceil(Math.pow(1.07, buildingsState[id].owned));
          total = total+curCost;
          tmpCount++;
        }


        console.log(`Total for ${tmpCount} (request to buy ${amount}) buildings = ${total}`);
        return total;
  };

  function updateCashCount() {
    let cashIncrease = 0;
    buildingsState.forEach(element => {
      cashIncrease += element.owned * element.income;
    });
    setCashNum(cashNum => cashNum + cashIncrease);
    setCashRate(cashIncrease);
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
      setBuildingsOwned((buildingsOwned => buildingsOwned + 1));
    } else {
      console.log(`Noth enough cash to buy 1 of building ${id}`);
    }
  }


  // useEffect((e) => {
  //   console.log('updaing building prices');
  //   console.log(e);
  //   updateBuildingPrice(0);
  // }, [buildingsOwned]); // retrigger function call when the state value changes

  useEffect(() => {
    const interval = setTimeout(updateCashCount, TICK_RATE);

    return () => clearInterval(interval);
  }, [cashNum]); // retrigger function call when the state value changes

  useEffect(() => {
    const interval = setTimeout(updateChillCount, TICK_RATE);

    return () => clearInterval(interval);
  }, [chillCount]); // retrigger function call when the state value changes
  
  
  // useEffect(() => {
  
  //   var worker = new WebWorker(workerRoutine);
    
  //   // attach chill update logic to worker
  //   worker.addEventListener('message', event => {
  //     // console.log(`Setting count from worker listener to ${event.data}`)
  //     setChillCount(event.data);
  //   });
  //   // create a recursive postMessage call to the worker's code
  //   setTimeout(() => worker.postMessage([chillCount, chillRate]), TICK_RATE);

  //   // return function cleanup() {
  //   //   // console.log('end of workers lifecycle')
  //   //   worker.terminate()
  //   // };

  //   return () => worker.terminate();
  // }, [chillCount]); // retrigger function call when the state value changes


  return (
    <GameContainer className="main">
      <h1 className="text-primary">
        chills (WebWorker version): {chillCount.toFixed(2)} at {Math.round(chillRate * (66))}/s
      </h1>
      <h1 className="text-success">cash: {cashNum} at {Math.round(cashRate * (15))}/s </h1>
      <button className="btn btn-warning m-2" onClick={increaseChillRate}>
        +0.1 chill rate cur:{chillRate}
      </button>
      <button className="btn btn-warning m-2" onClick={decreaseChillRate}>
        -0.1 chill rate
      </button>
      <div className="d-flex flex-column">
        {buildingsState.map((e, index) => (
          <BuildingCard
            id={index}
            name={e.name}
            owned={e.owned}
            cost={e.cost}
            buyBuilding={handleBuyBuilding}
            warning_1={!(cashNum > e.cost)}
            warning_10={!(cashNum > e.cost_10)}
            warning_100={!(cashNum > e.cost_100)}
            price_1={e.cost}
            price_10={e.cost_10}
            price_100={e.cost_100}
          ></BuildingCard>
        ))}
      </div>
    </GameContainer>
  );
}
