import React from 'react';
// import { Route, Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Menu, Layout } from 'antd';

const MenuItem = Menu.Item;
const { Header } = Layout;

const MainMenu = ({ changePage }) => {
  const onClick = (obj) => { changePage(obj.key); }

  return (
    <Header style={{ /*background: 'white',*/ marginBottom: 2 }}>
      <div className="logo" />
      <Menu theme="dark" onClick={onClick} mode="horizontal" style={{ lineHeight: '64px' }}>
        <MenuItem key="/">Home</MenuItem>
        <MenuItem key="/posts">Posts</MenuItem>
        <MenuItem key="/authors">Authors</MenuItem>
        <MenuItem key="/about-us">About</MenuItem>
      </Menu>
    </Header>
  );
}

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: (url) => push(url)
}, dispatch)


export default connect(null, mapDispatchToProps)(MainMenu);
