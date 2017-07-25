import _ from 'lodash';
import React from 'react'
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd';
import { gql, graphql } from 'react-apollo';
import fieldsDisplayConditionsHelpers from '../../helpers/fieldsDisplayConditionsHelpers';
import renderInputsHelpers from '../../helpers/renderInputsHelpers';
import mutationGenerator from '../../helpers/mutationGenerator';

const FormItem = Form.Item;

class FormGenerator {
  constructor({ options, model, mutationName, isUpdate, amon, combinedFields }) {
    this.options = options;
    this.model = model;
    this.mutationName = mutationName;
    this.isUpdate = isUpdate;
    this.amon = amon;
    this.combinedFields = combinedFields;
  }

  generateInputs(props) {
    const { options, model, amon, combinedFields } = this;
    const { changePage, data, form, locale, record } = props;

    const inputs = [];
    _.forEach(combinedFields, (field, fieldName, index) => {
      if(!fieldsDisplayConditionsHelpers.shouldShowField(field, 'form')) return;

      let initialValue;
      if(!!record && record[fieldName]) {
        initialValue = record[fieldName];
        if(field.type === 'relationship') initialValue = record[fieldName].id;
      }

      const params = {
        key: fieldName,
        form,
        field,
        initialValue,
        model,
        amon
      }

      inputs.push(renderInputsHelpers.render(params));
    });

    return inputs;
  }

  handleSubmit({ form, mutate, changePage, record }, event) {
    event.preventDefault();
    const { options, model, mutationName } = this;
    const idParams = record && record.id ? { id: record.id } : {};

    form.validateFields((err, newRecord) => {
      if (!err) {
        console.log('Received values of form: ', record);
        mutate({ variables: { ...idParams, ...newRecord } }).then((response) => {
          console.log('response', response);
          const id = response.data[mutationName].id;
          changePage(`/${options.url}/${id}/show`);
        }).catch((error) => {
          console.log('ERROD: ', error);
          const errorData = JSON.parse(JSON.stringify(error))
          const fieldName = errorData.message.split("'$")[1].split("'")[0];
          form.setFields({
            [fieldName]: {
              value: newRecord[fieldName],
              errors: [new Error('There is some error here!')],
            },
          })

        });
      }
    });
  }

  generate() {
    const { options, model } = this;

    const Component = (props) => {
      const { changePage, data, form } = props;

      const inputs = this.generateInputs(props);

      return (
        <Form layout="vertical" style={{ maxWidth: 500 }} onSubmit={this.handleSubmit.bind(this, props)}>
          {inputs}
          <FormItem>
            <Button type="primary" htmlType="submit" ghost>Register</Button>
          </FormItem>
        </Form>
      );
    }

    return this.bindReduxAndQueries(Component);
  }

  bindReduxAndQueries(Component) {
    const { options, model, mutationName, isUpdate, amon } = this;

    const mapDispatchToProps = (dispatch) => bindActionCreators({
      changePage: (url) => push(url)
    }, dispatch)

    const createQuery = mutationGenerator.generate(mutationName, model, isUpdate, amon);

    return connect(null, mapDispatchToProps)(
      graphql(createQuery)(
        Form.create()(Component)
      )
    );
  }
}

export default FormGenerator;
