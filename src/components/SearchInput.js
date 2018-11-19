import React, { PureComponent } from "react";
import { Input } from 'antd';

const Search = Input.Search;

// Stateless component for more performances

class SearchInput extends PureComponent {

    // Function without binding beacause it doesn't have constructor
    handleChange = event => {
        this.props.textChange(event);
    };

    render() {
        return (
            <Search 
                placeholder="Search plugins"
                onChange={this.handleChange}
            />
        );
    }
}
export default SearchInput;