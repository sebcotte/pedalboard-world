import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import firebase from '../firebase.js';
import {Form, Icon, Input, Button, Checkbox, Alert} from 'antd';
import './LoginPage.css';

const FormItem = Form.Item;

class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogErr:false,
      errmsg: ""
    }
  }

  onClose = (e) => {
    console.log(e, 'I was closed.');
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
        firebase.auth().signInWithEmailAndPassword(values.email, values.password).catch((error) => {
          // Handle Errors here.
          var errorMessage = error.message;
          this.setState(
            {isLogErr:true,
            errmsg:errorMessage}
          )
        });
      }
    });
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
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>Remember me</Checkbox>
            )}
            <a className="login-form-forgot" href="">Forgot password</a>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <a href="">register now!</a>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(LoginPage);