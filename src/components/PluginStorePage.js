import React, { Component } from 'react';

import firebase from '../firebase.js';
import * as firebaseUtils from "../functions/firebaseUtils";
import {filterPlugins,filterPluginsByTag} from '../functions/filterPlugins';

import { Card, Col, Row, Tag, Divider, Button, Pagination } from 'antd';
import SearchInput from './SearchInput';

class PluginStorePage extends Component {
    authListener
    authStrategy
    constructor() {
        super();
        this._authStrategy = firebaseUtils.connectedPage.bind(this)
        this.state = {
            totalPlugins: 0,
            totalPluginsPages: 0,
            pluginsPerPage: 10,
            plugins: [],
            filteredPlugins: [], // use this list for search bar
            mainTag: null,
            isTagVisible: false
        }
        // Event listeners
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDeletedMainTag = this.handleDeletedMainTag.bind(this);
    }

    // ----- BEGIN Event listeners -----
    handlePagination(current,size) {
        let start = (this.state.pluginsPerPage*((current)-1));
        let end = (start + this.state.pluginsPerPage);
        this.setState({
        filteredPlugins: this.state.plugins.slice(start, end)
        })
    }

    handleChange(e) {
        // e should be an input, so we get the value of the input
        this.setState({
        [e.target.name]: e.target.value
        });
    }

    // When add a plugin
    handleSubmit(e) {
        // prevent the default behavior of the form 
        // by default it should refresh page, we don't want this
        e.preventDefault();
        // Location where we store data
        const itemsRef = firebase.database().ref('pedals');
        const item = {
        creator: this.state.creator,
        pic: this.state.pic,
        //tags: ['toto', 'tata'],
        tags: 'titi',
        description: this.state.description,
        details: [{name: 'Name', value: 'Value', min: 'Min', max: 'Max'}]
        }
        itemsRef.push(item); // store object in Firebase
        // Clear the inputs, they will be empty
        this.setState({
        creator: '',
        pic: '',
        tags: [],
        description: '',
        details: [{name: '', value: '', min: '', max: ''}]
        });
    }

    handleSearch(e) {
        this.setState({
        filteredPlugins: filterPlugins(e.target.value, this.state.plugins),
        });
    }

    handleTagSearch(e) {
        this.setState({
        filteredPlugins: filterPluginsByTag(e, this.state.plugins),
        mainTag: e,
        isTagVisible: true
        });
    }

    handleDeletedMainTag(e) {
        this.setState({
        filteredPlugins: filterPluginsByTag("", this.state.plugins),
        mainTag: null,
        isTagVisible: false
        })
    }
    // ------ END Event Listeners --------

    // Function to get data from FireBase and save data in the state
    componentDidMount() {
        // We store data in 'pedals'
        const itemsRef = firebase.database().ref('pedals');
        // If one item has been added in the database
        // Or if it's the first time the event listener has been attached
        // the callback is called
        itemsRef.on('value', (callback) => {
        // All items come from the Firebase db
        let items = callback.val();
        let newState = []; // we will store the items here
        let pluginsPerPage = this.state.pluginsPerPage;
        for (let item in items) {
            newState.push({
            id: item,
            creator: items[item].creator,
            pic: items[item].pic,
            tags: items[item].tags,
            description: items[item].description,
            details: items[item].details,
            });
        }
        // Update App state
        this.setState({
            plugins: newState,
            filteredPlugins: newState.slice(0,pluginsPerPage),
            totalPlugins: newState.length,
            totalPluginsPages: (Math.ceil((newState.length-1) / pluginsPerPage))*10        
        });
        });

        this.setState({
            authListener: this._authStrategy()
        })
    }

    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/pedals/${itemId}`);
        itemRef.remove();
    }

    render() {
        return (
            <div>
                <h1 style={{ textAlign: 'center' }}>Galerie des plugins</h1>
                
                <SearchInput textChange={this.handleSearch} />
                <Tag 
                closable 
                visible={this.state.isTagVisible} 
                onClose={this.handleDeletedMainTag}
                >
                {this.state.mainTag}
                </Tag>
                
                <br/><br/>
    
                <Row type="flex" justify="center" align="top">
                {this.state.filteredPlugins.map((item) => {
                    return (
                    <Col key={item.id} xs={{span: 18, offset: 3}} sm={{span: 12, offset: 0}} lg={{span: 6, offset: 0}}>
                        <Card
                        cover={<img alt="example" src={item.pic} />}
                        style={{ marginLeft: 10,marginRight: 10, marginBottom: 20 }}
                        >
                        <Row type="flex" justify="center" align="top">
                            <Tag onClick={()=> {this.handleTagSearch(item.tags)}}>{item.tags}</Tag>
                            {//item.tags.map((tag) => {return <Tag>{tag}</Tag>})
                            }
                        </Row>
                        <Divider />
                        <h3 style={{textAlign:'center',alignSelf:'center'}}>{item.details[0].name}</h3>
                        <p style={{textAlign:'center'}}>{item.creator}</p>
                        <Row type="flex" justify="center" align="top">
                            <Button type="danger" onClick={() => this.removeItem(item.id)}>Remove plugin</Button>
                        </Row>
                        </Card>
                    </Col>
                    )
                })}
                </Row>
                <br/><br/>
                <Row type="flex" justify="center" align="top">
                <Pagination
                simple
                defaultCurrent={1}
                total={this.state.totalPluginsPages}
                onChange={(current,size)=> this.handlePagination(current,size)} />
                </Row>
                <br/><br/>
                <section className="add-item">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="creator" placeholder="Vendeur/Créateur du plugin" onChange={this.handleChange} value={this.state.creator} />
                    <input type="url" name="pic" placeholder="URL de l'image" onChange={this.handleChange} value={this.state.pic} />
                    <input type="text" name="description" placeholder="Description" onChange={this.handleChange} value={this.state.description} />
                    <button>Add Plugin</button>
                </form>
                </section>
            </div>
        );
    }
}
export default PluginStorePage;