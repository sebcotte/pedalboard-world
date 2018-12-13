import React from 'react';
import { Link } from 'react-router-dom';
import firebase from '../firebase.js';
import * as firebaseUtils from "../functions/firebaseUtils";
import {
    Form, Input, Tooltip, Icon, Select, Button, Alert, Row, Col
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class RegisterPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        confirmDirty: false,
        autoCompleteResult: [],
        isLogErr:false,
        errmsg: ""
    }
    this._authStrategy = firebaseUtils.visitorPage.bind(this)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
        .then((result)=>{
          let newUser = firebase.database().ref().child('users').push();
          newUser.set({
            id: result.user.uid,
            username: values['nickname'],
            email: values['email'],
            phone: values['phone']
          });
        })
        .catch((error) => {
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

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Les deux mots de passe que vous avez entré sont invalides !');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  componentDidMount(){
    this.setState({
      authListener: this._authStrategy()
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    return (
        <div>
          <Row>
            <h1>S'enregistrer</h1>
          </Row>
          <Row type="flex" justify="start">
            <Col span={12}>
              { this.state.isLogErr
              ? <Alert
              message="Error"
              description={this.state.errmsg}
              type="error"
              showIcon
              />
              : ''
              }
              <Form onSubmit={this.handleSubmit}>
                  <FormItem>
                  {getFieldDecorator('email', {
                      rules: [{
                      type: 'email', message: 'Ceci n\'est pas une adresse mail valide !',
                      }, {
                      required: true, message: 'Veuillez entrer votre email !',
                      }],
                  })(
                      <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email"  />
                  )}
                  </FormItem>
                  <FormItem>
                  {getFieldDecorator('password', {
                      rules: [{
                      required: true, message: 'Veuillez entrer un mot de passe !',
                      }, {
                      validator: this.validateToNextPassword,
                      }],
                  })(
                      <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Mot de passe" />
                  )}
                  </FormItem>
                  <FormItem>
                  {getFieldDecorator('confirm', {
                      rules: [{
                      required: true, message: 'Veuillez confirmer votre mot de passe !',
                      }, {
                      validator: this.compareToFirstPassword,
                      }],
                  })(
                      <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Confirmer mot de passe" onBlur={this.handleConfirmBlur} />
                  )}
                  </FormItem>
                  <FormItem>
                  {getFieldDecorator('nickname', {
                      rules: [{ required: true, message: 'Veuillez entrer un pseudo !', whitespace: true }],
                  })(
                      <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                  )}
                  </FormItem>
                  <FormItem>
                  {getFieldDecorator('phone', {
                      rules: [{ required: true, message: 'Veuillez entrer votre numéro de téléphone !' }],
                  })(
                      <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="06 78 65 43 56" />
                  )}
                  </FormItem>
                  <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                      S'enregistrer
                    </Button>
                  Ou <Link to="/login">Vous connecter</Link>
                  </FormItem>
              </Form>
            </Col>
          </Row>
        </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegisterPage);

export default WrappedRegistrationForm;