import React, { Component } from 'react';
import { Layer, Line } from 'react-konva';

class Grid extends Component {
    render() {
      const { color = "blue", size = 1, interval = 50, x, y } = this.props;
  
      return (
        <Layer>
          {
            Array(Math.round(x / interval) + 1).fill(null).map((elem, i) => (
              <Line
                key={i}
                points={[interval * i, 0, interval * i, x]}
                stroke={color}
                strokeWidth={size}
              />
            ))
          }
          {
            Array(Math.round(y / interval) + 1).fill(null).map((elem, i) => (
              <Line
                points={[0, interval * i, x, interval * i]}
                stroke={color}
                strokeWidth={size}
              />
            ))
          }
        </Layer>
      )
    }
  }

  export default Grid;