import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import * as routes from '../routes';


const Navigation = () => {
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
                    <Link to={routes.ADD_PLUGIN}>Add plugin</Link>
                </Menu.Item>
                <Menu.Item key="3">
                    <Link to={routes.ACCOUNT}>My account</Link>
                </Menu.Item>
            </Menu>
        </div>
    );

}

export default Navigation;