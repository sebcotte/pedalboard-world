import React, { Component } from 'react';
import firebase from '../firebase.js';
import * as firebaseUtils from "../functions/firebaseUtils";
import { Row, Col, Tag, Table, Button } from 'antd';

class PluginDetails extends Component {
    authListener
    authStrategy
    constructor(props) {
        super(props);
        this._authStrategy = firebaseUtils.connectedPage.bind(this)
        this.state = {
            plugin: {
                creator: '',
                name: '',
                creatorWebsite: '',
                tags: [],
                description: '',
                pic: '',
                details: []
            },
            param: this.props.match.params
        }
        this.columns = [{
            title: 'Contrôle',
            dataIndex: 'control'
          }, {
            title: 'Par défaut',
            dataIndex: 'default'
          }, {
            title: 'Max',
            dataIndex: 'max'
          }, 
          {
            title: 'Min',
            dataIndex: 'min'
          }];
    }

    // ----- BEGIN Event listeners -----
    // ------ END Event Listeners --------

    // Function to get data from FireBase and save data in the state
    componentDidMount() {
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
            // Update App state
            this.setState({
                plugin: plugin
            });
        });
    }

    render() {
        return (
            <div>
                <Row type="flex" justify="end" align="top">
                    <Button type="primary" href={this.props.location.pathname.split("/").slice(0,1).join("/")+"/add-plugin/"+this.state.param.id}>Modifier le plugin</Button><br/>
                </Row>
                <Row> 
                    <h1 style={{ textAlign: 'center' }}>{this.state.plugin.name}</h1>
                    <h3 style={{ textAlign: 'center' }}>
                        Créé par <a href={this.state.plugin.creatorWebsite} title={this.state.plugin.creator} target="_blank">{this.state.plugin.creator}</a>
                    </h3>
                </Row>
                <br/>
                <Row type="flex" justify="center" align="top">
                    <img src={this.state.plugin.pic} alt={this.state.plugin.name}/>
                </Row>
                <Row type="flex" justify="center" align="top">
                    {this.state.plugin.tags.map((tag, i) => {return <Tag key={i} color="geekblue">{tag}</Tag>})}
                </Row>
                <br/><br/>
                <Row type="flex" justify="center" align="top">
                    <p>{this.state.plugin.description}</p>
                </Row>
                <br/><br/>
                <Row type="flex" justify="center" align="top">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>
                    <Table columns={this.columns} dataSource={this.state.plugin.details}/>
                </Row>
            </div>
        );
    }
}
export default PluginDetails;