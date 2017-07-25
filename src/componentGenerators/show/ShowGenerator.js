import _ from 'lodash';
import React from 'react'
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd';
import { FieldDisplay } from '../../components'
import { gql, graphql } from 'react-apollo';
import fieldsDisplayConditionsHelpers from '../../helpers/fieldsDisplayConditionsHelpers';
import renderFieldsHelpers from '../../helpers/renderFieldsHelpers';

class ShowGenerator {
  constructor({ options, model }) {
    this.options = options;
    this.model = model;
  }

  generateFields({ record }) {
    const { options, model } = this;

    const lines = _.map(options.fields, (item, key, index) => {
      if(!fieldsDisplayConditionsHelpers.shouldShowField(item, 'show')) return false;

      const fieldSettings = _.result(model, `fields.${key}`, {});
      const label = _.result(fieldSettings, 'label', key);

      return (
        <FieldDisplay key={key} label={label}>
          {renderFieldsHelpers.render(record[key], record, fieldSettings, 'full')}
        </FieldDisplay>
      )
    });

    return lines;
  }

  generate() {
    const { options, model } = this;

    const Component = (props) => {
      const { changePage, data } = props;

      const fields = this.generateFields(props);

      return (
        <div>
          {fields}
        </div>
      );
    }

    return Component;
  }
}

export default ShowGenerator;
