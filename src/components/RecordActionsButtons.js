import React from 'react';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo';
import { Button } from 'antd'

const ButtonGroup = Button.Group;

const RecordActionsButtons = ({ id, url, changePage, icon, data, onDelete }) => {
  const onClickDropdown = (obj) => { changePage(obj.key); }

  return (
    <div>
      <Button icon="edit" shape="circle" onClick={changePage.bind(null, `/${url}/${id}/edit`)} style={{ marginLeft: 6, marginRight: 6 }}></Button>
      <Button type="danger" shape="circle" icon="delete" onClick={() => onDelete()}></Button>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changePage: (url) => push(url)
}, dispatch);

export default connect(null, mapDispatchToProps)(RecordActionsButtons)
