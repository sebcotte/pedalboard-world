import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from './Navigation'
import * as routes from '../routes';
import PluginStorePage from './PluginStorePage';
import AddPluginPage from './AddPluginPage';
import SingleViewPlugin from './SingleViewPlugin';

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
            <Switch>
              <Route 
                exact path={routes.HOME}
                component={PluginStorePage}
              />

              <Route 
                path={routes.ADD_PLUGIN}
                component={AddPluginPage}
              />

              <Route 
                path={routes.SINGLE_VIEW_PLUGIN}
                component={SingleViewPlugin}
              />

              <Route
                render={ ()=> <h1>404 Page not found</h1>}
              />

            </Switch>            
            
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
