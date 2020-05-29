import React, {useState, useEffect, useReducer} from 'react';

import BuildingCard from './BuildingCard';

import styled from 'styled-components';

const TICK_RATE = 1000/10;

const GameContainer = styled.div`
    font-size: 34px;
    height: 600px;
    margin: 10px;
    display: flex;
    align-items: center;
    flex-direction: column;
    /* justify-content: center; */
`;

const CashTextDisplay = styled.h2`
    color: green;
`;

const PositiveTextDisplay = styled.h3`
    color: lightgreen;
`;

const NegativeTextDisplay = styled.h3`
    color: red;
`;

const ChillCountDisplay = styled.h1`
    color: blue;
`;

const buildingsList =[
    {
        name: 'Tea',
        cost: 100,
        owned: 0,
        income: 1,
    },
    {
        name: 'Coffee',
        cost: 1000,
        owned: 0,
        income: 5,
    },
    {
        name: 'Beer',
        cost: 10000,
        owned: 0,
        income: 15,
    },
    {
        name: 'Vodka',
        cost: 100000,
        owned: 0,
        income: 30,
    },
    {
        name: 'Absinthe',
        cost: 1000000,
        owned: 0,
        income: 60,
    },

];


export default function Game() {
    const [positiveNum, setPositiveNum] = useState(1);
    const [negativeNum, setNegativeNum] = useState(0);
    const [chillCount, setChillCount] = useState(1000);
    const [cashNum, setCashNum] = useState(1000);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [buildingsState, setBuilding] = useState(buildingsList);



    function updateChillCount() {
        if(positiveNum > negativeNum && chillCount > 0) {
            setChillCount((chillCount) => chillCount - 1);
        } else if (chillCount === 0) {
            setLevelCompleted(true);
        }
        

        setTimeout(
            updateChillCount, TICK_RATE);
    }

    function updateCashCount() {
        let cashIncrease = 0;
        buildingsState.forEach(element => {
            cashIncrease += element.owned*element.income;
        });



        // console.log(cashIncrease);
        setCashNum((cashNum) => cashNum + cashIncrease);

        setTimeout(
            updateCashCount, TICK_RATE);
    }


    async function handleBuyBuilding(id) {
        // TODO: check cash against rising cost changes. 
        if(cashNum > buildingsState[id].cost) {

            console.log(`Buying 1 of building ${id}`)

            const buildingsCopy = [...buildingsState];

            buildingsCopy[id].owned += 1;
            // console.log(buildingsCopy[id].owned);

            console.log(`Cost: ${buildingsState[id].cost}`)
            console.log(`Cash: ${cashNum}`)


            console.log(cashNum - buildingsState[id].cost);
            setCashNum((cashNum) => cashNum - buildingsState[id].cost);

            if(cashNum < 0) console.log('WTFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');

            let costIncrease = Math.ceil(Math.pow(1.07, buildingsCopy[id].owned));
            buildingsCopy[id].cost += costIncrease;

            setBuilding(buildingsCopy);

            console.table(buildingsCopy[id]);

            // substract cash (pay)
        } else {
            // not enough cash
            // make button red
            console.log(`Noth enough cash to buy 1 of building ${id}`)
        }
    }


    useEffect(() => {
        const interval = setTimeout(
          updateChillCount, TICK_RATE);
        const interval2 = setTimeout(
          updateCashCount, TICK_RATE);

        // return () => clearInterval(interval);
      }, []);


    //   useEffect(() => {
    //     const interval = setTimeout(
    //       updateChillCount, 2000);
    //     // return () => clearInterval(interval);
    //   }, []);

    return(
        <GameContainer className="main">
            {/* {levelCompleted ? <p>Level completed!</p> : ''} */}
            <div className="main-banner">
                <span>Tot: {chillCount}</span>
                <CashTextDisplay>Cash: {cashNum}</CashTextDisplay>
            </div>
            <div className="w-50">
                <div>
                    <PositiveTextDisplay>Pos: {positiveNum}</PositiveTextDisplay>
                </div>
                <div>
                    <NegativeTextDisplay>Neg: {negativeNum}</NegativeTextDisplay>
                </div>
                {buildingsState.map((e, index) => (

                    <BuildingCard id={index} 
                                  name={e.name} 
                                  owned={e.owned} 
                                  cost={e.cost}
                                  buyBuilding={handleBuyBuilding}
                                  warning={!(cashNum > e.cost)}>
                                  
                    </BuildingCard>
                ))}
                
            </div>

        </GameContainer>
    );
}

// const BuildingList = ({buildings, handleFunc}) => (
//         <div>
//         {buildings.map((e, index) => (
                            
//                             <div key={index}>
//                             <p>{e.name}</p>
//                             <p>Owned: {e.owned}</p>
//                             <p>Cost: {e.cost}</p>
//                             <button onClick={() => handleFunc(index, 1)}>BUY 1 NEWWWW</button>
//                             {console.log(`Rendering building ${index}`)}

//                         </div>
//                         ))}
//         </div>
// );

// const MemoBuilidingList = React.memo(BuildingList);

