import React, { Component } from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';
import { Grid, TransformerComponent } from './Components'

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = { selected: "yolo", lineStart: { x: 200, y: 100 }, lineEnd: { x: 450, y: 100 } };

    this.onStageClick = this.onStageClick.bind(this);
    this.onMoveCircle = this.onMoveCircle.bind(this);
  }

  onStageClick(e) {
    if (e.target == e.target.getStage()) {
      this.setState({ selected: "" });
      return;
    }

    if (e.target.className == "Circle") {
      this.setState({ selected: e.target.name() });
      return;
    }

    const parent = e.target.getParent();
    if (parent && parent.className === "Transformer") {
      return;
    }
  }

  onMoveCircle(e) {
    console.log(`Circle ${e.target.name()} moved to [${e.evt.x}:${e.evt.y}]`);
    if (e.target.name() == "greenone") {
      this.setState({ lineEnd: { x: e.target.attrs.x, y: e.target.attrs.y } });
    }
    if (e.target.name() == "redone") {
      this.setState({ lineStart: { x: e.target.attrs.x, y: e.target.attrs.y} });
    }
  }

  render() {
    console.log("Height : ", window.innerHeight);
    console.log("Width : ", window.innerWidth);

    return (
      <div>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={this.onStageClick}
        >
          <Layer>
            <Circle x={450} y={100} radius={50} fill="green" draggable={true} name="greenone"
              onDragMove={this.onMoveCircle}
            />
            <Circle x={200} y={100} radius={50} fill="red" draggable={true} name="redone" 
              onDragMove={this.onMoveCircle}
            />
            <Line
              points={[this.state.lineStart.x, this.state.lineStart.y, this.state.lineEnd.x, this.state.lineEnd.y]}
              stroke="black"
              strokeWidth={5}
            />
            <TransformerComponent
              selectedShapeName={this.state.selected}
            />
          </Layer>
          <Grid y={window.innerHeight} x={window.innerWidth} />
        </Stage>
      </div>
    )
  }
};

export default Board;