import { ApolloClient, createNetworkInterface } from 'react-apollo';

const networkInterface = createNetworkInterface({ uri: 'https://api.graph.cool/simple/v1/cj52f6oesdov001758467ssrj' });

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }

    // get the authentication token from local storage if it exists
    if (localStorage.getItem('graphcoolToken')) {
      req.options.headers.authorization = `Bearer ${localStorage.getItem('graphcoolToken')}`
    }
    next()
  },
}]);

const options = {
  networkInterface,
  dataIdFromObject: o => o.id
}

const client = new ApolloClient(options);

export default client;
