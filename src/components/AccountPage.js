import React from 'react';
import { Avatar, Row, Col, Button } from 'antd';
import firebase from '../firebase.js';
import * as firebaseUtils from "../functions/firebaseUtils";

class AccountPage extends React.Component {
  authListener
  authStrategy
  constructor() {
    super()
    this.state = {
      user: null
    }
    this._authStrategy = firebaseUtils.connectedPage.bind(this);
    this.getUserInfos = this.getUserInfos.bind(this);
  }

  getUserInfos() {
    let userId = -1;
    if(firebaseUtils.getLoggedUser()) {
      userId = firebaseUtils.getLoggedUser().uid;
      console.log(userId);
    }
    let currentUser = firebase.database().ref(`/users/${userId}`);
    
    return currentUser;
  }

  disconnectUser() {
    firebase.auth().signOut().then(function() {
      console.log("Disconnecting user")
    }).catch(function(error) {
      console.log(error)
    });
  }
  
  componentDidMount() {
    this.setState({
      authListener: this._authStrategy(),
      user: this.getUserInfos()
    });
  }

  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Mon compte</h1>
        <Row type="flex" justify="center" align="middle">
          <Col span={3} offset={8}><Avatar size={64} icon="user" /></Col>
          <Col span={12}><h3>{this.state.user ? this.state.user.email : 'Undefined'}</h3></Col>
          <Col span={12} offset={12}><h3>{this.state.user ? this.state.user.displayName : 'Undefined'}</h3></Col>
          <Col span={12} offset={12}><h3>{this.state.user ? this.state.user.phone : 'Undefined'}</h3></Col>
        </Row>

        <Row type="flex" justify="end" align="middle">
          <Button onClick={() => {this.disconnectUser()}} type="primary">Deconnexion</Button>
        </Row>
      </div>
    );
  }
}

export default AccountPage;