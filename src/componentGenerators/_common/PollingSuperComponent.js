import React, { Component } from 'react';

class Polling extends Component {
  componentDidMount() {
    this.props.data.startPolling(5000);
  }

  componentWillUnmount() {
    this.props.data.stopPolling();
  }
}

export default Polling;
