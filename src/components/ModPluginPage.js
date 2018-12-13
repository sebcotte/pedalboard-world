import React from 'react';
import { Redirect } from 'react-router-dom';
import './AddPluginPage.css';
import { Row, Form, Select, Upload, Button, Icon, Input, Table, Popconfirm, Alert } from 'antd';
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
            this.props.source.length >= 1
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
        displayTable: true
      };
    }
  
    handleDelete = (key) => {
      const dataSource = [...this.props.source].filter(item => item.key !== key);
      this.setState({
        dataSource: dataSource
      });
      this.props.handler(dataSource)
    }
  
    handleAdd = () => {
      const dataSource = this.props.source;
      const count = dataSource[dataSource.length-1].key+1;
      const newData = {
        key: count,
        control: 'Contrôle',
        default: 0,
        min: 0,
        max: 0
      };
      this.setState({
        dataSource: [...dataSource, newData],
        count: count
      });
      this.props.handler([...dataSource, newData])
    }
  
    handleSave = (row) => {
      const newData = [...this.props.source];
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
            dataSource={this.props.source}
            columns={columns}
          />
        </div>
      );
    }
}

class ModPluginPage extends React.Component {
  authListener
  authStrategy
  constructor(props) {
    super(props)
    this._authStrategy = firebaseUtils.connectedPage.bind(this)
    this.handleAddControl.bind(this)
    this.state = {
      controlData: [],
      isAddSuccess: false,
      plugin: {
          creator: '',
          name: '',
          creatorWebsite: '',
          tags: [],
          description: '',
          pic: ''
      },
      param: this.props.match.params
    }
  }

  fillInputs = (values) => {
    this.props.form.setFieldsValue({
      creatorName: values.creator,
      pluginName: values.name,
      creatorWebsite: values.creatorWebsite,
      multipleTags: values.tags,
      pluginDesc: values.description
    });
  }

  getModdedPlugin = () => {
    // We get the target plugin id
    var pluginId = this.state.param.id;
    // We store data in 'plugins'
    const itemsRef = firebase.database().ref('plugins/'+pluginId);
    const picsRef = firebase.storage().ref();
    // If one item has been added in the database
    // Or if it's the first time the event listener has been attached
    // the callback is called
    itemsRef.on('value', (callback) => {
        // All items come from the Firebase db
        let plugin = callback.val();
        //console.log(plugin)
        this.fillInputs(plugin)
        // Update App state
        this.setState({
          controlData: plugin.details,
          plugin: plugin
        });
    });
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
    let dataref = firebase.database().ref('plugins').child(this.state.param.id);
    console.log(values)

    // Create var of ctrls
    let controls = this.state.controlData

    // Create a root reference
    let storageRef = firebase.storage().ref();

    if(values["pluginImg"][0].originFileObj) {
      const img = values["pluginImg"][0].originFileObj
      // Create a reference to 'images/pic.jpg'
      var imagesRef = storageRef.child('images/'+img.name);
      var file = img // use the Blob or File API
      imagesRef.put(file).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          dataref.update({
            creator: values['creatorName'],
            name: values['pluginName'],
            creatorWebsite: values['creatorWebsite'],
            tags: values['multipleTags'],
            description: values['pluginDesc'],
            pic: downloadURL,
            details: controls
          });
          this.handleReset()
          this.setState({
            isAddSuccess: true
          })
        });
      });
    } else {
      dataref.update({
        creator: values['creatorName'],
        name: values['pluginName'],
        creatorWebsite: values['creatorWebsite'],
        tags: values['multipleTags'],
        description: values['pluginDesc'],
        details: controls
      });
      this.handleReset()
      this.setState({
        isAddSuccess: true
      })
    }
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
    this.getModdedPlugin()
    this.setState({
      authListener: this._authStrategy()
    })
  }

    render() {
        const { getFieldDecorator } = this.props.form;
        const fileList = [{
          uid: '-1',
          name: 'img.png',
          status: 'done',
          url: this.state.plugin.pic,
          thumbUrl: this.state.plugin.pic,
        }];

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
          <div>
            <Row>
              <h1>Modifier un plugin</h1>
            </Row>
            { this.state.isAddSuccess
              ? <Alert
              message="Plugin ajouté avec succès !"
              description="Votre plugin est désormais ajouté."
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
                    {getFieldDecorator('creatorWebsite', {
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
                    {getFieldDecorator('creatorName', {
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
                    {getFieldDecorator('pluginName', {
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
                    {getFieldDecorator('multipleTags', {
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
                    {getFieldDecorator('pluginImg', {
                        rules: [
                            { required: false, message: 'Veuillez séléctionner une image!', type: 'array' },
                        ],
                        valuePropName: 'fileList',
                        getValueFromEvent: this.normFile,
                        initialValue:[...fileList]
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
                    {getFieldDecorator('pluginDesc', {
                        rules: [{
                            required: true, message: 'Veuillez écrire un description!',
                        }],
                    })(
                        <TextArea />
                    )}
                </FormItem>

                <FormItem>
                  {getFieldDecorator('pluginControl')(
                    <EditableTable
                    handler={this.handleAddControl}
                    source={this.state.controlData}
                    />
                  )}
                </FormItem>   

                <FormItem
                    wrapperCol={{ span: 12, offset: 6 }}
                >
                    <Button type="primary" htmlType="submit">Modifier plugin</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>Reinitialiser</Button>
                </FormItem>          
            </Form>
          </div>
        );
    } 
}
export default Form.create()(ModPluginPage);