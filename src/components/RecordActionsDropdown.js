import React from 'react';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Dropdown, Icon, Menu } from 'antd'

const RecordActionsDropdown = ({ record, url, changePage, icon }) => {
  const onClickDropdown = (obj) => { changePage(obj.key); }

  const menu = (
    <Menu onClick={onClickDropdown}>
      <Menu.Item key={`/${url}/${record.id}/show`}>Show Details</Menu.Item>
      <Menu.Item key={`/${url}/${record.id}/edit`}>Edit</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" style={{ color: 'tomato' }}>Delete</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <a className="ant-dropdown-link">
        <Icon type={icon || 'bars'} />
      </a>
    </Dropdown>
  )
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changePage: (url) => push(url)
}, dispatch);

export default connect(null, mapDispatchToProps)(RecordActionsDropdown);
