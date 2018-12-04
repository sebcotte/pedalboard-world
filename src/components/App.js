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

import isUserLogged from "../functions/firebaseUtils";

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

          <Content style={{ padding: '50px' }}>
            <Switch>
              <Route 
                exact path={routes.HOME}
                render={() => (
                  isUserLogged ? (
                    <PluginStorePage/>
                  ) : (
                    <Redirect to="/login"/>
                  )
                )}
              />

              <Route 
                exact path={routes.ADD_PLUGIN}
                render={() => (
                  isUserLogged ? (
                    <AddPluginPage/>
                  ) : (
                    <Redirect to="/login"/>
                  )
                )}
              />

              <Route 
                exact path={routes.ACCOUNT}
                render={() => (
                  isUserLogged ? (
                    <AccountPage/>
                  ) : (
                    <Redirect to="/login"/>
                  )
                )}
              />

              <Route 
                exact path={routes.LOGIN}
                render={() => (
                  isUserLogged ? (
                    <Redirect to="/"/>
                  ) : (
                    <LoginPage/>
                  )
                )}
              />

              <Route
                exact path={routes.REGISTER}
                render={() => (
                  isUserLogged ? (
                    <Redirect to="/"/>
                  ) : (
                    <RegisterPage/>
                  )
                )}
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
