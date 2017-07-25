import React from 'react';
import { render } from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { ApolloProvider } from 'react-apollo';
import store, { history } from './store';
import registerServiceWorker from './registerServiceWorker';
import App from './containers/_layouts/App';
import apolloClient from './apollo';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import moment from 'moment';

import amon from './client/amonSettings';
import './styles.css'

const target = document.querySelector('#root')


const config = (amon) => {
  render(
    <ApolloProvider client={apolloClient} store={store}>
      <LocaleProvider locale={enUS}>
        <ConnectedRouter history={history}>
          <App amon={amon} />
        </ConnectedRouter>
      </LocaleProvider>
    </ApolloProvider>,
    target
  )

  registerServiceWorker();
}

export default config;
