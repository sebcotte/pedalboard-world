import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Link } from 'react-router-dom';

import firebase from '../firebase.js';
import * as firebaseUtils from "../functions/firebaseUtils";

import {Form, Icon, Input, Button, Checkbox, Alert} from 'antd';
import './LoginPage.css';

const FormItem = Form.Item;

class LoginPage extends React.Component {
  authListener
  authStrategy
  constructor(props) {
    super(props)
    this.state = {
      isLogErr:false,
      isLogged:false,
      errmsg: ""
    }
    this._authStrategy = firebaseUtils.visitorPage.bind(this)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
        firebase.auth().signInWithEmailAndPassword(values.email, values.password)
        .then((user) => {
          this.setState(
            {
              isLogged:true,
              isLogErr:false
            }
          )

          this.props.history.replace("/")
        })
        .catch((error) => {
          // Handle Errors here.
          var errorMessage = error.message;
          this.setState(
            {
              isLogErr:true,
              isLogged:false,
              errmsg:errorMessage}
          )
        });
      }
    });
  }

  componentDidMount(){
    this.setState({
      authListener: this._authStrategy()
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        { this.state.isLogErr
          ? <Alert
          message="Error"
          description={this.state.errmsg}
          type="error"
          showIcon
          />
          : ''
        }
        { this.state.isLogged
          ? <Alert
          message="Success Tips"
          description="Detailed description and advices about successful copywriting."
          type="success"
          showIcon
          />
          : ''
        }
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Veuillez entrer un mail' }],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Veuillez entrer un password' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>Se souvenir de moi</Checkbox>
            )}
            <a className="login-form-forgot" href="">Forgot password</a>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Ou <Link to="/register">Inscrivez-vous maintenant</Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(LoginPage);