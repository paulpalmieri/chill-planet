import React, {useState, useEffect, useReducer} from 'react';

import BuildingCard from './BuildingCard';

import styled from 'styled-components';

const TICK_RATE = 100;
const chillTarget = 7000000000;

const GameContainer = styled.div`
    font-size: 34px;
    height: 600px;
    margin: 10px;
    display: flex;
    align-items: center;
    flex-direction: column;
    /* justify-content: center; */
`;

const buildingsList =[
    {
        name: 'Tea',
        cost: 100,
        owned: 0,
        income: 1,
    },
    {
        name: 'Beer',
        cost: 1000,
        owned: 0,
        income: 5,
    },
    {
        name: 'Weed',
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
        name: 'Cocktail',
        cost: 1000000,
        owned: 0,
        income: 60,
    },

];


export default function Game() {

    const [positiveNum, setPositiveNum] = useState(1);
    const [negativeNum, setNegativeNum] = useState(0);
    const [chillCount, setChillCount] = useState(0);
    const [cashNum, setCashNum] = useState(100000);
    const [buildingsState, setBuilding] = useState(buildingsList);
    const [chillRate, setChillRate] = useState(1);



    const increaseChillRate = () => {
        setChillRate((chillRate) => chillRate + 10);
    };

    const updateChillCount = () => {
        console.log(chillRate);

        setChillCount((chillCount) => chillCount + chillRate);
        

        // setTimeout(
        //     updateChillCount, 1000);
    }

    function updateCashCount() {
        let cashIncrease = 0;
        buildingsState.forEach(element => {
            cashIncrease += element.owned*element.income;
        });



        // console.log(cashIncrease);
        setCashNum((cashNum) => cashNum + cashIncrease);

        // setTimeout(
        //     updateCashCount, TICK_RATE);
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


    // start initial timer and retrigger when own state changes
    useEffect(() => {

        const interval = setTimeout(
          updateCashCount, TICK_RATE);

        return () => clearInterval(interval);

      }, [cashNum]);

      useEffect(() => {
        const interval = setTimeout(
          updateChillCount, TICK_RATE);

        return () => clearInterval(interval);

      }, [chillCount]);




    return(
        <GameContainer className="main">
            <div className="main-banner">
                
            </div>
            <h1 className="text-primary">Ca chill sec: {chillCount} / {chillTarget}</h1>
            <h1 className="text-success">${cashNum}</h1>
            <button className="btn btn-warning" onClick={increaseChillRate}>Increase chill rate from {chillRate} to {chillRate + 10}</button>
            {/* {console.log(chillRate)} */}
            <div className="w-50">
            
                {/* <div>
                    <PositiveTextDisplay>Pos: {positiveNum}</PositiveTextDisplay>
                </div>
                <div>
                    <NegativeTextDisplay>Neg: {negativeNum}</NegativeTextDisplay>
                </div> */}
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

