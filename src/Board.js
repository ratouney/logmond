import React, { Component } from 'react';
import { Stage, Layer, Circle, Transformer } from 'react-konva';

class TransformerComponent extends React.Component {
    componentDidMount() {
      this.checkNode();
    }
    componentDidUpdate() {
      this.checkNode();
    }
    checkNode() {
      // here we need to manually attach or detach Transformer node
      const stage = this.transformer.getStage();
      const { selectedShapeName } = this.props;
  
      const selectedNode = stage.findOne('.' + selectedShapeName);
      // do nothing if selected node is already attached
      if (selectedNode === this.transformer.node()) {
        return;
      }
  
      if (selectedNode) {
        // attach to another node
        this.transformer.attachTo(selectedNode);
      } else {
        // remove transformer
        this.transformer.detach();
      }
      this.transformer.getLayer().batchDraw();
    }
    render() {
      return (
        <Transformer
          ref={node => {
            this.transformer = node;
          }}
        />
      );
    }
}

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {hello: "there", selected: "yolo"};

        this.onStageClick = this.onStageClick.bind(this);
    }

    onStageClick(e) {
      if (e.target == e.target.getStage()) {
        this.setState({selected: ""});
        return;
      }

      if (e.target.className == "Circle") {
        console.log("Selected a circle !");
        this.setState({selected: e.target.name()});
        return;
      }

      const parent = e.target.getParent();
      if (parent && parent.className === "Transformer") {
        return;
      }
    }

    render() {
        console.log("Selected shape : ", this.state.selected);

        return (
            <div>
                <Stage 
                  width={window.innerWidth} 
                  height={window.innerHeight}
                  onMouseDown={this.onStageClick}
                >
                    <Layer>
                        <Circle x={450} y={100} radius={50} fill="green" draggable={true} name="greenone" />
                        <Circle x={200} y={100} radius={50} fill="red" draggable={true} name="redone" />
                        <TransformerComponent
                          selectedShapeName={this.state.selected}
                        />
                    </Layer>
                </Stage>
            </div>
        )
    }
};

export default Board;