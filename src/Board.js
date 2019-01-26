import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Stage, Layer, Circle } from 'react-konva';
import { Grid } from './Components'

class Board extends Component {
  constructor(props) {
    super(props);

    this.container = null;

    this.state = {
      stageWidth: 600,
      stageHeigh: 600,
    };

    this.updateStageSize = this.updateStageSize.bind(this)
  }

  componentDidMount() {
    this.updateStageSize();

    window.addEventListener("resize", this.updateStageSize);
  }

  componentWillUnmount()
  {
    window.removeEventListener("resize", this.updateStageSize);
  }

  updateStageSize = () => {
    // console.log(`Setting size to ${this.container.offsetWidth}x${this.container.offsetHeight}`);

    this.setState({
      stageWidth: this.container.offsetWidth,
      stageHeight: this.container.offsetHeight
    })
  }

  render() {
    const { forms } = this.props;

    return (
      <div
        className="mainStage"
        ref={(cont) => { this.container = cont }}
      >
        <Stage
          width={this.state.stageWidth}
          height={this.state.stageHeigh}
          onMouseDown={this.onStageClick}
        >
          <Layer>
            <Circle x={450} y={100} radius={50} fill="green" draggable={true} name="greenone"/>
          </Layer>
          <Grid x={this.state.stageWidth} y={this.state.stageHeigh} interval={100} />
        </Stage>
      </div>
    )
  }
};

function mapStateToProps(state) {
  console.log("State : ", state);
  return {
    forms: state.FormReducer.forms,
  }
}

export default connect(mapStateToProps)(Board);