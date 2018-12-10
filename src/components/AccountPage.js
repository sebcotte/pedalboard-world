import React from 'react';
import { Avatar, Row, Col, Button } from 'antd';
import firebase from '../firebase.js';
import * as firebaseUtils from "../functions/firebaseUtils";

class AccountPage extends React.Component {
  authListener
  authStrategy
  constructor() {
    super()
    this.state = {}
    this._authStrategy = firebaseUtils.connectedPage.bind(this)
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
      user: firebaseUtils.getLoggedUser()
    })
  }

  render() {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Mon compte</h1>
        <Row type="flex" justify="center" align="middle">
          <Col span={3} offset={8}><Avatar size={64} icon="user" /></Col>
          <Col span={12} offset={1}><h3>{this.state.user ? this.state.user.email : 'Undefined'}</h3></Col>
        </Row>

        <Row type="flex" justify="end" align="middle">
          <Button onClick={() => {this.disconnectUser()}} type="primary">Deconnexion</Button>
        </Row>
      </div>
    );
  }
}

export default AccountPage;