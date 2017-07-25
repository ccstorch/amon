import _ from 'lodash';
import React from 'react';
import { Route } from 'react-router-dom'
import Menu from './Menu';
import { Layout } from 'antd';
import { gql, graphql } from 'react-apollo';

import HomeView from '../home/HomeView'
import AboutView from '../about/AboutView'

const { Content, Footer } = Layout;

const App = ({ data, amon }) => {
  return (
    <Layout className="layout" style={{ display: 'flex', flexDirection: 'col-reverse', height: '100%' }}>
      <Menu />
      <Content style={{ padding: '0', flex: 1, display: 'flex' }}>
        <div style={{ background: '#fff', padding: '32px 70px', flex: 1, minHeight: 400 }}>
          {_.map(amon.components.views, ({ Component, url }) => {
            return (
              <Route key={url} exact path={'/' + url} component={Component} />
            )
          })}
          <Route exact path="/" component={HomeView} />
          <Route exact path="/about-us" component={AboutView} />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Footer
      </Footer>
    </Layout>
  );
}

const signinUser = gql`
  mutation ($email: String!, $password: String!) {
    signinUser(email: {email: $email, password: $password}) {
      token
    }
  }
`

const userQuery = gql`
  query {
    user {
      id
    }
  }
`

export default graphql(signinUser, {name: 'signinUser'})(
  graphql(userQuery, { options: { fetchPolicy: 'network-only' }})(App)
)
