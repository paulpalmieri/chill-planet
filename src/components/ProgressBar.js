import React from "react";

const ProgressBar = (props) => {
    const { bgcolor, completed } = props;
  
    const containerStyles = {
      height: 16,
      width: '100%',
      backgroundColor: "#e0e0de",
      borderRadius: 50,
      opacity: 1,
      animation: "fade 2s linear",
    }
  
    const fillerStyles = {
      height: '100%',
      width: `${completed}%`,
      backgroundColor: bgcolor,
      borderRadius: 'inherit',
      textAlign: 'center',
      transition: 'width 0.250s',
      animationDirection: 'alternate',
    }
  
    const labelStyles = {
      // padding: 5,
      color: 'white',
      fontWeight: 'bold'
    }
  
    return (

      <div style={containerStyles}>
        <div style={fillerStyles}>
          {/* <span style={labelStyles}>{`${completed}%`}</span> */}
          <span style={labelStyles}>{}</span>
        </div>

      </div>
    );
  };
  
  export default ProgressBar;

