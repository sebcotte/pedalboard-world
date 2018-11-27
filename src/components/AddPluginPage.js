import React from 'react';
import { Redirect } from 'react-router-dom';
import './AddPluginPage.css';
import { Form, Select, Upload, Button, Icon, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

const FormItem = Form.Item;
const Option = Select.Option;

// un vendeur : URL du site du créateur
// nom du créateur (kuiza)
// une image
// un ou plusieurs tags
// descritption
// un table de détails : control, default, min, max, 


class AddPluginPage extends React.Component {

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
export default Form.create()(AddPluginPage);