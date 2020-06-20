import React, { useState, useEffect } from "react";

import _ from "lodash";

import ProgressBar from "./ProgressBar";
import { motion, AnimatePresence } from "framer-motion";

import node_iron_png from "../assets/NODE_IRON.png";
import node_gold_png from "../assets/NODE_GOLD.png";

import styled from "styled-components";

const variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 }
};

const MainContainer = styled.div`
  display: flex;
  /* width: 50%; */
  align-items: center;
  flex-direction: column;
  /* justify-content: center; */
`;

const CashDisplay = styled.div`
  color: #55ce7e;
  font-size: 18px;
`;

const ContainerFlex = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 12px;
  margin: 4px;
  align-items: center;
  background-color: #f8f8f8;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;

  label {
    color: #adadad;
  }

  div {
    margin-right: 30px;
  }
`;

const SingleStatContainer = styled.div``;

const ImageContainer = styled.img`
  /* margin-left: 20px; */
  margin-right: 12px;
`;

const NODE_TYPES = {
  IRON: {
    name: "Iron ore",
    png: node_iron_png,
    completetime: 3 * 1000,
    lifespan: 2,
    yield: 1,
    color: "#80778E"
  },
  GOLD: {
    name: "Gold ore",
    png: node_gold_png,
    completetime: 5000,
    lifespan: 3,
    yield: 1,
    color: "#E19055"
  }
};

const initialNodes = [
  {
    name: "Iron ore",
    png: node_iron_png,
    completetime: 6 * 1000,
    lifespan: 100,
    yield: 1,
    workers: 1,
    remaining: 100,
    progress: 0,
    last_tick: performance.now(),
    isVisible: true
  },
  {
    name: "Iron ore",
    png: node_iron_png,
    completetime: 8 * 1000,
    lifespan: 100,
    yield: 1,
    workers: 1,
    remaining: 100,
    progress: 0,
    last_tick: performance.now(),
    isVisible: true
  }
];

export default function GameV3() {
  const [money, setMoney] = useState(1000);
  const [previous_timestamp, setPrevioustimstamp] = useState(0);
  const [partial_ticks, setPartialticks] = useState(0);

  let gameloop = React.useRef();
  const [nodes, setNodes] = useState([]);
  const [emptyNodes, setEmptyNodes] = useState([]);

  useEffect(() => {
    console.log("Starting gameloop...");
    // console.log(nodes);

    let anim = requestAnimationFrame(gameloop.current);
    console.log("Animation loop");
  }, []); // retrigger function call when the state value changes

  // let previous_timestamp;
  // let partial_ticks = 0;
  const update_rate = 150;

  gameloop.current = function(timestamp) {
    console.log(`Timestamp: ${timestamp}`);

    let time_difference = timestamp - previous_timestamp;

    console.log(`Time diff between calls: ${time_difference}`);
    setPrevioustimstamp(timestamp);

    console.log(`Previous timestamp: ${previous_timestamp}`);
    setPartialticks(partial_ticks => partial_ticks + time_difference);
    // partial_ticks += time_difference;

    if (partial_ticks > update_rate) {
      console.log(
        `Entering condition with ptick: ${partial_ticks} and ${update_rate}`
      );
      // const nodesCopy = [...nodes];
      // console.log(nodesCopy);
      const nodesCopy = _.cloneDeep(
        _.orderBy(nodes, o => o.remaining, ["desc"])
      );

      nodesCopy.forEach((n, index) => {
        const difference = timestamp - n.last_tick;
        console.log(`Diff: ${difference} for node ${index}`);
        if (difference < n.completetime) {
          console.log(`Node ${index} updating.`);
          // not yet yielded
          n.progress = (difference * 100) / n.completetime;

          //   node.last_tick = performance.now();
        } else {
          // yield
          console.log(`Node ${index} done.`);
          n.remaining -= n.yield;

          // const OrderedCopy = _.orderBy(nodesCopy, o => o.remaining, ['desc']);

          if (n.remaining === 0 || n.remaining < 0) {
            n.isVisible = false;

            nodesCopy.splice(index, 1);
          } else {
            n.progress = 0;
            n.last_tick = performance.now();
          }
        }
      });

      // console.log('should update')
      setNodes([...nodesCopy]);
      console.log(`Partial ticks before end of tick: ${partial_ticks}`);
      // partial_ticks -= update_rate;

      setPartialticks(partial_ticks => partial_ticks - update_rate);

      console.log(`Partial ticks after end of tick: ${partial_ticks}`);
      // console.log(partial_ticks);
    }

    setNodes(nodesCopy => [...nodesCopy]);

    // console.log(`Money inside gameloop: ${money}`);

    requestAnimationFrame(gameloop.current);
  };

  function spawnNode() {
    let nodesCopy = _.cloneDeep(nodes);
    console.log("Spawning new node...");
    let randomNum = Math.floor(Math.random() * 2);
    // let randomNum = 1;
    let newNode = NODE_TYPES[Object.keys(NODE_TYPES)[randomNum]];
    newNode.workers = 1;
    newNode.remaining = newNode.lifespan;
    newNode.progress = 0;
    newNode.isVisible = true;
    newNode.last_tick = performance.now();

    setNodes([...nodesCopy, newNode]);
    console.log(`Spawned new node`);
  }

  // requestAnimationFrame(gameLoop);
  return (
    <MainContainer>
      <CashDisplay>$ {money}</CashDisplay>

      <button onClick={spawnNode}>Spawn</button>

      <AnimatePresence>
        {nodes.map((n, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0.5,
                x: -50
              }}
              transition={{ duration: 1 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <NodeContainer index={i} node={n}></NodeContainer>
            </motion.div>

          // <motion.div key={index} initial={{
          //   opacity: 0
          // }}
          // transition={{ duration: 2 }}
          // animate={node.isVisible ? "visible" : "hidden"} variants={variants} exit={{opacity: 0}}>
          //   <div>Name: {node.name} </div>
          //   <div>Workers: {node.workers} </div>
          //   <div>Lifespan: {node.lifespan} </div>
          //   <div>Remaining: {node.remaining} </div>
          //   <div>Yield: {node.yield} </div>

          //   <img height={32} src={node.png}></img>
          //   <ProgressBar
          //     key={index}
          //     bgcolor="#6a1b9a"
          //     completed={Math.ceil(node.progress)}
          //     ></ProgressBar>
          // </motion.div>
        ))}
      </AnimatePresence>
    </MainContainer>
  );
}

const NodeTitle = styled.div`
  color: ${props => props.color};
  font-weight: bold;
`;
const NodeContainer = props => {
  return (
    <ContainerFlex>
      <ImageContainer height={64} src={props.node.png}></ImageContainer>

      <InfoContainer>
        <NodeTitle color={props.node.color}>{props.node.name} </NodeTitle>
        <StatsContainer>
          <SingleStatContainer>
            <div>{props.node.workers} </div>
            <label>Workers</label>
          </SingleStatContainer>
          <SingleStatContainer>
            <div>{props.node.lifespan} </div>
            <label>Lifespan</label>
          </SingleStatContainer>
          <SingleStatContainer>
            <div>{props.node.remaining} </div>
            <label>Remaining</label>
          </SingleStatContainer>
          <SingleStatContainer>
            <div>{props.node.yield} </div>
            <label>Yield</label>
          </SingleStatContainer>
        </StatsContainer>

        <ProgressBar
          key={props.index}
          bgcolor={props.node.color}
          completed={Math.ceil(props.node.progress)}
        ></ProgressBar>
      </InfoContainer>
    </ContainerFlex>
  );
};
