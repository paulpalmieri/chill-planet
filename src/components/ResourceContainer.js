import React from "react";
import styled from "styled-components";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "react-bootstrap";

const ResourceContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  /* justify-content: center; */
  align-items: center;
  border: 1px solid lightgrey;
  border-radius: 6px;
  margin: 4px;
  padding: 6px;
  div {
    padding-bottom: 4px;
  }

  button {
    margin-bottom:2px;
  }
`;

const ProgressBarContainer = styled.div`
  height: 100px;
  width: 100px;
  margin-top: 4px;
`;

const ResourceLabel = styled.p`
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 4px;
`;

const styledTest = styled.div`
  background-color: black;
`;

const StartButton = styled.div`
  color: pink;
  background-color: blue;
  width: 40px;
  text-align: center;
`;

// Contains the circular progress bar, some stats and some buttons
export default function ResourceContainer(props) {
  // display variables
  let time_left_s = Math.ceil(props.time_left / 1000);
  let percent_left =
    Math.ceil((props.time_left * 100) / props.time) == 0
      ? 0
      : 100 - Math.ceil((props.time_left * 100) / props.time);

  return (
    <ResourceContainerStyled key={props.id}>
      <ProgressBarContainer>
        <CircularProgressbar
          className="w-100"
          value={props.value}
          text={`${time_left_s}s, ${percent_left < 0 ? 100 : percent_left}%`}
          styles={buildStyles({
            pathTransition: "10ms linear",
            pathColor: `${props.color}`,
            textColor: "#000000",
            trailColor: "#d6d6d6",
            backgroundColor: "#3e98c7"
            // pathTransition: "straightLine 2.5s infinite linear"
          })}
        />
      </ProgressBarContainer>
      <ResourceLabel>{props.name}</ResourceLabel>

      <div>${props.income}</div>
      <div>Time (ms): {props.time}</div>
      <div>Time (s): {props.time / 1000}</div>
      {props.can_start ? (
        <Button onClick={() => props.handleClick(props.id)}>start</Button>
      ) : props.automated ? (
        <Button variant="success">automated</Button>
      ) : (
        ""
      )}
      {/* <span>{Math.round(e.income / (e.time / 1000))}/s</span> */}
      {/* <span>{props.icon}</span> */}
      {/* {console.log(props)} */}
    </ResourceContainerStyled>
  );
}
