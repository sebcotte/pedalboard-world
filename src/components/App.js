import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from './Navigation'
import * as routes from '../routes';
import PluginStorePage from './PluginStorePage';
import AddPluginPage from './AddPluginPage';

import { Layout, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;

class App extends Component {  

  render(){
    return (
      <Router>
        <Layout className="layout">
          <Header>
            <div className="logo" />
            <Navigation />
          </Header>

          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Plugin store</Breadcrumb.Item>
            </Breadcrumb>

            <Route 
              exact path={routes.HOME}
              component={PluginStorePage}
             />

            <Route 
              exact path={routes.ADD_PLUGIN}
              component={AddPluginPage}
            />
            
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Router>
    );
  }
}
export default App;
