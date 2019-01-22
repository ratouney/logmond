import React, { Component } from 'react';
import Board from './Board';
import { connect } from 'react-redux';
import { Layout, Menu, Icon, Button, Row, Col } from 'antd';
import { addForm } from './ducks/Forms';
import './App.css';

const { Sider, Content, Footer, Header } = Layout;

class App extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  render() {
    return (
      <div className="App">
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Row style={{ marginBottom: '8px' }} >
                <Col>
                  <Button onClick={() => { this.props.onAddForm({name: "Ding", type: "circle", color: "green"}) }} >
                      Add form
                    </Button>
                </Col>
              </Row>
              <Row style={{ marginBottom: '8px' }}>
                <Col>
                  <Button>
                      General
                    </Button>
                </Col>
              </Row>
              <Row style={{ marginBottom: '8px' }}>
                <Col>
                  <Button>
                      Kenobi
                    </Button>
                </Col>
              </Row>
          </Sider>
          <Layout>
            <Content style={{ padding: '24 24 24 24' }} height="500">
              <div style={{ background: '#fff' }}>
                <Board />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onAddForm: (args) => {
      console.log("Dispatching action call");
      dispatch(addForm(args));
    }
  }
}

export default connect(null, mapDispatchToProps)(App);
