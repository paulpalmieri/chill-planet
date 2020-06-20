import React, {useReducer, useEffect} from "react";
import {storeReducer} from "../reducers/reducers"

import {getInitialStore} from "../store/store";
// import {doTick}

// create container from react-tracked
import { createContainer } from "react-tracked";

// create the reducer 
const useValue = () => useReducer(storeReducer, getInitialStore());
const { Provider, useTrackedState, useUpdate } = createContainer(useValue);

export { useTrackedState as useStore, useUpdate as useDispatch };