import React from 'react';
import { Redirect } from 'react-router-dom';
import './AddPluginPage.css';
import { Form, Select, Upload, Button, Icon, Input, Table, Popconfirm } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import firebase from '../firebase.js';

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
  constructor(props) {
    super(props)
    const user = firebase.auth().currentUser;
    if (user) {
      console.log(user)
    } else {
      console.log("aucun user")
    }
  }
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
                  <a href="javascript:;">Supprimer</a>
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
      const dataSource = [...this.state.dataSource];
      this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
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
            dataSource={dataSource}
            columns={columns}
          />
        </div>
      );
    }
}

class AccountPage extends React.Component {
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                return <Redirect to="/account" />
            }
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

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
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
                        <Upload name="pluginImg" action="/upload.do" listType="picture">
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

                <EditableTable />   

                <FormItem
                    wrapperCol={{ span: 12, offset: 6 }}
                >
                    <Button type="primary" htmlType="submit">Valider</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>Clear</Button>
                </FormItem>          
            </Form>
        );
    } 
}
export default Form.create()(AccountPage);