import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navigation from './Navigation'
import * as routes from '../routes';
import PluginStorePage from './PluginStorePage';
import AddPluginPage from './AddPluginPage';
import AccountPage from './AccountPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

import * as firebaseUtils from "../functions/firebaseUtils";

import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {user:null}
  }

  componentDidMount(){
  }

  render(){
    return (
      <Router>
        <Layout className="layout">
          <Header>
            <div className="logo" />
            <Navigation />
          </Header>

          <Content style={{ padding: '50px' }}>
            <Switch>
              <Route
                exact path={routes.HOME}
                component={PluginStorePage}
              />

              <Route 
                exact path={routes.ADD_PLUGIN}
                component={AddPluginPage}
              />

              <Route 
                exact path={routes.ACCOUNT}
                component={AccountPage}
              />

              <Route 
                exact path={routes.LOGIN}
                component={LoginPage}
              />

              <Route
                exact path={routes.REGISTER}
                component={RegisterPage}
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
