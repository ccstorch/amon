import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Button from 'antd/lib/button';
import amon from '../../client/amonSettings';

const Home = props => {
  if(!amon) return false;

  const { Component: Form } = amon.getComponent('NewGeneralPostForm');

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome home!</p>
      <Form />
      <Button onClick={() => props.changePage()}>Go to about page via redux</Button>
    </div>
  )
}

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: () => push('/about-us')
}, dispatch)

export default connect(
  null,
  mapDispatchToProps
)(Home)
