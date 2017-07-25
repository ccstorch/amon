import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd';
import { gql, graphql } from 'react-apollo';
import { PageHeader } from '../../components'
import FormGenerator from './FormGenerator';
import querySingleGenerator from '../../helpers/querySingleGenerator';

class EditRecordViewGenerator {
  constructor({ options, model, amon, combinedFields }) {
    this.options = options;
    this.model = model;
    this.amon = amon;
    this.combinedFields = combinedFields;
  }

  generate() {
    const { options, model, amon, combinedFields } = this;

    const FormComponent = new FormGenerator({ options, model, mutationName: model.api.update, isUpdate: true, amon, combinedFields }).generate();

    const Component =  ({ match, data }) => {
      const { id } = match.params;

      if (data.loading) {
        return (<div>Loading</div>)
      }

      let record = false;
      if(data[model.api.single]) {
        record = data[model.api.single];
      }

      return (
        <div>
          <PageHeader title={'Edit ' + model.labels.single} showReturn />
          {record && <FormComponent record={record} />}
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

export default EditRecordViewGenerator;
