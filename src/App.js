import React, { Component } from 'react';
import './App.css';
import firebase from './firebase.js';

import { Layout, Menu, Breadcrumb, Input, Card, Col, Row, Tag, Divider, Button, Pagination } from 'antd';
const { Header, Content, Footer } = Layout;
const Search = Input.Search;

class App extends Component {

  constructor() {
    super();
    this.state = {
      totalPedals: 0,
      totalPedalsPage: 0,
      pedalsPerPage: 10,
      creator: '',
      pic: '',
      tags: [],
      description: '',
      details: [{
        name: '',
        value: '',
        min: '',
        max: ''
      }],
      pedals: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    // e should be an input, so we get the value of the input
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  // When add a pedal
  handleSubmit(e) {
    // prevent the default behavior of the form 
    // by default it should refresh page, we don't want this
    e.preventDefault();
    // Location where we store data
    const itemsRef = firebase.database().ref('pedals');
    const item = {
      creator: this.state.creator,
      pic: this.state.pic,
      tags: ['toto', 'tata'],
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
      let pedalsPerPage = this.state.pedalsPerPage;
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
        pedals: newState,
        totalPedals: newState.length,
        totalPedalsPages: (Math.ceil(newState.length / pedalsPerPage))*10        
      });
    });
  }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/pedals/${itemId}`);
    itemRef.remove();
  }

  render() {
    return (
        <Layout className="layout">
          <Header>
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">Plugin store</Menu.Item>
              <Menu.Item key="2">Add plugins</Menu.Item>
              <Menu.Item key="3">My account</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Plugin store</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
              <h1 style={{ textAlign: 'center' }}>Pedal Boards</h1>
              <Search
                placeholder="Search plugins"
                onSearch={value => console.log(value)}
                enterButton
              />
              <br/><br/>
              <Row type="flex" justify="center" align="top">
                {this.state.pedals.map((item) => {
                  return (
                    <Col xs={{span: 18, offset: 3}} sm={{span: 12, offset: 0}} lg={{span: 6, offset: 0}}>
                      <Card
                        key={item.id}
                        cover={<img alt="example" src={item.pic} />}
                        style={{ marginLeft: 10,marginRight: 10, marginBottom: 20 }}
                      >
                        <Row type="flex" justify="center" align="top">
                          <Tag>{item.tags}</Tag>
                          {//item.tags.map((tag) => {return <Tag>{tag}</Tag>})
                          }
                        </Row>
                        <Divider />
                        <h3 style={{textAlign:'center',alignSelf:'center'}}>{item.details[0].name}</h3>
                        <p style={{textAlign:'center'}}>{item.creator}</p>
                        <Row type="flex" justify="center" align="top">
                          <Button type="danger" onClick={() => this.removeItem(item.id)}>Remove pedal</Button>
                        </Row>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
              <br/><br/>
              <Row type="flex" justify="center" align="top">
                <Pagination simple defaultCurrent={1} total={this.state.totalPedalsPages} />
              </Row>
              <br/><br/>
              <section className="add-item">
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="creator" placeholder="Vendeur/Créateur du plugin" onChange={this.handleChange} value={this.state.creator} />
                  <input type="url" name="pic" placeholder="URL de l'image" onChange={this.handleChange} value={this.state.pic} />
                  <input type="text" name="description" placeholder="Description" onChange={this.handleChange} value={this.state.description} />
                  <button>Add Pedal</button>
                </form>
              </section>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
    );
  }
}
export default App;
