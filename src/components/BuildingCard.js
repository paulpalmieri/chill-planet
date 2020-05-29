import React, {useState, useEffect, useReducer} from 'react';



export default function BuildingCard(props) {

    return(
        <div className="container w-100 p-2 flex-column d-flex mt-2 border" key={props.id}>
            <h5>{props.name}  </h5>
            <h6>Owned: {props.owned}  </h6>
            <h6>Cost: {props.cost}  </h6>
            <button className={props.warning ? 'btn btn-danger' : 'btn btn-primary'} onClick={() => props.buyBuilding(props.id, 1)}>BUY 1</button>

            {/* {console.log(`Rendering building ${props.id}`)} */}
        </div>

    );
}