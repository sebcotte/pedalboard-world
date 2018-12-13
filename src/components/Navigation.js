import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import firebase from '../firebase.js';
import * as routes from '../routes';

class Navigation extends React.Component {
    user
    constructor(props) {
        super(props)
        this.user = null
        this.state = {user:null}
    }

    componentDidMount() {
        this.initUser()
    }

    initUser() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({user})
            }
        });
    }

    render() {
        return(
            <div>
                <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1">
                        <Link to={routes.HOME}>Plugin store</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to={routes.ADD_PLUGIN}>Ajouter plugin</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link to={routes.ACCOUNT}>Mon compte {this.state.user ? '('+this.state.user.email+')' : ''}</Link>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default Navigation;