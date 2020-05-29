import React, {useState, useEffect, useReducer} from 'react';


export default function BuildingCard(props) {

    return(
        <div className=" p-2 flex-column d-flex mt-2 border" key={props.id}>
            <h5 className="text-primary">{props.name}  </h5>
            <h6 className="text-info">Owned: {props.owned}  </h6>
            <h6 className="text-info">Cost: {props.cost}  </h6>
            <button className={props.warning ? 'btn btn-danger m-1' : 'btn btn-primary m-1'} onClick={() => props.buyBuilding(props.id)}>BUY 1</button>
            {/* <button className={props.warning ? 'btn btn-danger m-1' : 'btn btn-primary m-1'} onClick={() => props.buyMultiBuilding(props.id, 10)}>BUY 10</button>
            <button className={props.warning ? 'btn btn-danger m-1' : 'btn btn-primary m-1'} onClick={() => props.buyMultiBuilding(props.id, 100)}>BUY 100</button> */}


            {/* {console.log(`Rendering building ${props.id}`)} */}
        </div>

    );
}