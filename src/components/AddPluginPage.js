import React from 'react';
import { Redirect } from 'react-router-dom';
import './AddPluginPage.css';
import { Form, Select, Upload, Button, Icon, Input, Table, Popconfirm, Alert } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import firebase from '../firebase.js';

import * as firebaseUtils from "../functions/firebaseUtils";
import { cpus } from 'os';

// un vendeur : URL du site du créateur
// nom du créateur (kuiza)
// une image
// un ou plusieurs tags
// descritption
// un table de détails : control, default, min, max, 

const FormItem = Form.Item;
const Option = Select.Option;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    state = {
      editing: false,
    }
  
    componentDidMount() {
      if (this.props.editable) {
        document.addEventListener('click', this.handleClickOutside, true);
      }
    }
  
    componentWillUnmount() {
      if (this.props.editable) {
        document.removeEventListener('click', this.handleClickOutside, true);
      }
    }
  
    toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) {
          this.input.focus();
        }
      });
    }
  
    handleClickOutside = (e) => {
      const { editing } = this.state;
      if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
        this.save();
      }
    }
  
    save = () => {
      const { record, handleSave } = this.props;
      this.form.validateFields((error, values) => {
        if (error) {
          return;
        }
        this.toggleEdit();
        handleSave({ ...record, ...values });
      });
    }
  
    render() {
      const { editing } = this.state;
      const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        ...restProps
      } = this.props;
      return (
        <td ref={node => (this.cell = node)} {...restProps}>
          {editable ? (
            <EditableContext.Consumer>
              {(form) => {
                this.form = form;
                return (
                  editing ? (
                    <FormItem style={{ margin: 0 }}>
                      {form.getFieldDecorator(dataIndex, {
                        rules: [{
                          required: true,
                          message: 'Ce champs est requis',
                        }],
                        initialValue: record[dataIndex],
                      })(
                        <Input
                          ref={node => (this.input = node)}
                          onPressEnter={this.save}
                        />
                      )}
                    </FormItem>
                  ) : (
                    <div
                      className="editable-cell-value-wrap"
                      style={{ paddingRight: 24 }}
                      onClick={this.toggleEdit}
                    >
                      {restProps.children}
                    </div>
                  )
                );
              }}
            </EditableContext.Consumer>
          ) : restProps.children}
        </td>
      );
    }
}

class EditableTable extends React.Component {
    constructor(props) {
      super(props);
      this.columns = [{
        title: 'Contrôle',
        dataIndex: 'control',
        width: '30%',
        editable: true,
      }, {
        title: 'Par défaut',
        dataIndex: 'default',
        width: '15%',
        editable: true,
      }, {
        title: 'Min',
        dataIndex: 'min',
        width: '15%',
        editable: true,
      }, 
      {
        title: 'Max',
        dataIndex: 'max',
        width: '15%',
        editable: true,
      }, {
        title: 'Action',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            this.state.dataSource.length >= 1
              ? (
                <Popconfirm title="Vous êtes sûr ?" onConfirm={() => this.handleDelete(record.key)}>
                  <button>Supprimer</button>
                </Popconfirm>
              ) : null
          );
        },
      }];
  
      this.state = {
        dataSource: [],
        count: 0,
        displayTable: false
      };
    }
  
    handleDelete = (key) => {
      const dataSource = [...this.state.dataSource].filter(item => item.key !== key);
      this.setState({
        dataSource: dataSource
      });
      this.props.handler(dataSource)
    }
  
    handleAdd = () => {
      const { count, dataSource } = this.state;
      const newData = {
        key: count,
        control: 'Contrôle',
        default: 0,
        min: 0,
        max: 0
      };
      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
        displayTable: true
      });
      this.props.handler([...dataSource, newData])
    }
  
    handleSave = (row) => {
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      this.setState({ dataSource: newData });
      this.props.handler(newData)
    }
  
    render() {
      const { dataSource } = this.state;
      const components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        },
      };
      const columns = this.columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
          }),
        };
      });
      return (
        <div>
          <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
            Ajouter un paramètre
          </Button>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={this.state.dataSource}
            columns={columns}
          />
        </div>
      );
    }
}

class AddPluginPage extends React.Component {
  authListener
  authStrategy
  constructor() {
    super()
    this._authStrategy = firebaseUtils.connectedPage.bind(this)
    this.handleAddControl.bind(this)
    this.state = {
      controlData: [],
      isAddSuccess: false
    }
  }

  handleAddControl = (e) => {
    this.setState({
      controlData: e
    })
  }

  handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
          if (!err) {
            this.uploadPlugintoFirebase(values);
          }
      });
  }

  uploadPlugintoFirebase = (values) => {
    let dataref = firebase.database().ref('plugins');

    // Create var of ctrls
    let controls = this.state.controlData

    // Create a root reference
    let storageRef = firebase.storage().ref();

    let img = values["plugin-img"][0].originFileObj

    // Create a reference to 'images/pic.jpg'
    var imagesRef = storageRef.child('images/'+img.name);

    var file = img // use the Blob or File API
    imagesRef.put(file).then((snapshot) => {
      snapshot.ref.getDownloadURL().then((downloadURL) => {
        let newPluginRef = dataref.push();
        newPluginRef.set({
          creator: values['creator-name'],
          name: values['plugin-name'],
          creatorWebsite: values['creator-website'],
          tags: values['multiple-tags'],
          description: values['plugin-desc'],
          pic: downloadURL,
          details: controls
        });
        this.handleReset()
        this.setState({
          isAddSuccess: true
        })
      });
    });
  }

  handleImageUpload = (img) => {
    // Create a root reference
    var storageRef = firebase.storage().ref();

    // Create a reference to 'images/pic.jpg'
    var imagesRef = storageRef.child('images/'+img.name);

    var file = img // use the Blob or File API
    return imagesRef.put(file).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
      return snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log("File available at", downloadURL);
        return downloadURL;
      });
    });
  }

  handleReset = () => {
      this.props.form.resetFields();
  }

  normFile = (e) => {
      console.log('Upload event:', e);
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
  }

  componentDidMount() {
    this.setState({
      authListener: this._authStrategy()
    })
  }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
          <div>
            { this.state.isAddSuccess
              ? <Alert
              message="Success Tips"
              description="Detailed description and advices about successful copywriting."
              type="success"
              showIcon
              />
              : ''
            }
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="Site web du créateur"
                >
                    {getFieldDecorator('creator-website', {
                        rules: [{
                            type: 'url', message: "L'adresse n'a pas un format valide!",
                        }, {
                            required: true, message: 'Veuillez écrire une adresse web!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Nom du vendeur"
                >
                    {getFieldDecorator('creator-name', {
                        rules: [{
                            required: true, message: 'Veuillez écrire un nom!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Nom du plugin"
                >
                    {getFieldDecorator('plugin-name', {
                        rules: [{
                            required: true, message: 'Veuillez écrire un nom!',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Tag du plugin"
                >
                    {getFieldDecorator('multiple-tags', {
                        rules: [
                        { required: true, message: 'Veuillez séléctionner au moins un tag', type: 'array' },
                        ],
                    })(
                        <Select mode="multiple" placeholder="Séléctionner un tag">
                        <Option value="tag1">Tag1</Option>
                        <Option value="tag2">Tag2</Option>
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="Image du plugin"
                    extra="Format à respecter : 60x60"
                >
                    {getFieldDecorator('plugin-img', {
                        rules: [
                            { required: false, message: 'Veuillez séléctionner une image!', type: 'array' },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                    })(
                        <Upload name="pluginImg" customRequest={() => {return null}} listType="picture">
                        <Button>
                            <Icon type="upload" /> Télécharger
                        </Button>
                        </Upload>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="Description"
                >
                    {getFieldDecorator('plugin-desc', {
                        rules: [{
                            required: true, message: 'Veuillez écrire un description!',
                        }],
                    })(
                        <TextArea />
                    )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('plugin-control')(
                    <EditableTable
                    handler={this.handleAddControl}
                    />
                  )}
                </FormItem>   

                <FormItem
                    wrapperCol={{ span: 12, offset: 6 }}
                >
                    <Button type="primary" htmlType="submit">Valider</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>Clear</Button>
                </FormItem>          
            </Form>
          </div>
        );
    } 
}
export default Form.create()(AddPluginPage);