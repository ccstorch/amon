import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd';
import { gql, graphql } from 'react-apollo';
import { PageHeader, RecordActionsButtons } from '../../components'
import ShowGenerator from './ShowGenerator';
import querySingleGenerator from '../../helpers/querySingleGenerator';

class ShowRecordViewGenerator {
  constructor({ options, model, amon, combinedFields }) {
    this.options = options;
    this.model = model;
    this.amon = amon;
    this.combinedFields = combinedFields;
  }

  generate() {
    const { options, model } = this;

    const ShowComponent = new ShowGenerator({ options, model }).generate();

    const Component =  ({ match, data }) => {
      const { id } = match.params;

      if (data.loading) {
        return (<div>Loading</div>)
      }

      let record = false;
      let actions = false;
      if(data[model.api.single]) {
        record = data[model.api.single];
        actions = <div style={{ float: 'right' }}><RecordActionsButtons record={record} url={options.url} /></div>
      }

      return (
        <div>
          <PageHeader title={model.labels.single} showReturn rightContent={actions} />
          {record && <ShowComponent record={record} />}
          {!record && 'Not found'}
        </div>
      )
    }

    return this.bindReduxAndQueries(Component);
  }

  bindReduxAndQueries(Component) {
    const { options, model, amon, combinedFields } = this;

    const feedQuery = querySingleGenerator.generate(model.api.single, combinedFields, amon);

    return graphql(feedQuery, {
      options: ({ match }) => ({ variables: { id: match.params.id }})
    })(Component);
  }
}

export default ShowRecordViewGenerator;
