import React from 'react';
import firebase from '../firebase.js';
import * as firebaseUtils from "../functions/firebaseUtils";
import {
    Form, Input, Tooltip, Icon, Select, Button, Alert
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
        console.log('Received values of form: ', values);
        firebase.auth().createUserWithEmailAndPassword(values.email, values.password).catch((error) => {
            // Handle Errors here.
            //var errorCode = error.code;
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
                <FormItem
                {...formItemLayout}
                label="E-mail"
                >
                {getFieldDecorator('email', {
                    rules: [{
                    type: 'email', message: 'Ceci n\'est pas une adresse mail valide !',
                    }, {
                    required: true, message: 'Veuillez entrer votre email !',
                    }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="Mot de passe"
                >
                {getFieldDecorator('password', {
                    rules: [{
                    required: true, message: 'Veuillez entrer un mot de passe !',
                    }, {
                    validator: this.validateToNextPassword,
                    }],
                })(
                    <Input type="password" />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="Confirmer mot de passe"
                >
                {getFieldDecorator('confirm', {
                    rules: [{
                    required: true, message: 'Veuillez confirmer votre mot de passe !',
                    }, {
                    validator: this.compareToFirstPassword,
                    }],
                })(
                    <Input type="password" onBlur={this.handleConfirmBlur} />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label={(
                    <span>
                    Pseudo&nbsp;
                    <Tooltip title="Ce sera le nom qui sera affiché sur le site">
                        <Icon type="question-circle-o" />
                    </Tooltip>
                    </span>
                )}
                >
                {getFieldDecorator('nickname', {
                    rules: [{ required: true, message: 'Veuillez entrer un pseudo !', whitespace: true }],
                })(
                    <Input />
                )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="Téléphone"
                >
                {getFieldDecorator('phone', {
                    rules: [{ required: true, message: 'Veuillez entrer votre numéro de téléphone !' }],
                })(
                    <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">S'enregistrer</Button>
                </FormItem>
            </Form>
        </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegisterPage);

export default WrappedRegistrationForm;