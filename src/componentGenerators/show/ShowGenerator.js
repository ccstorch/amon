import _ from 'lodash';
import React from 'react'
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd';
import { FieldDisplay } from '../../components'
import { gql, graphql } from 'react-apollo';
import Polling from '../_common/PollingSuperComponent'
import querySingleGenerator from '../../helpers/querySingleGenerator';
import fieldsDisplayConditionsHelpers from '../../helpers/fieldsDisplayConditionsHelpers';
import renderFieldsHelpers from '../../helpers/renderFieldsHelpers';
import componentsNameGenerator from '../../helpers/componentsNameGenerator'
import customViewHelpers from '../../helpers/customViewHelpers'

class ShowGenerator {
  constructor(showSituation) {
    this.showSituation = showSituation;
  }

  generateFields({ data }) {
    const { viewOptions, model } = this.showSituation;
    const record = data[model.api.single];

    const lines = _.map(viewOptions.fields, (field, fieldName, index) => {
      const fieldSituation = { ...this.showSituation, field, fieldName, index };

      if(!fieldsDisplayConditionsHelpers.shouldShowField(fieldSituation)) return false;

      const fieldSettings = _.result(model, `fields.${fieldName}`, {});
      const label = _.result(fieldSettings, 'label', fieldName);

      return (
        <FieldDisplay key={fieldName} label={label}>
          {renderFieldsHelpers.render(record[fieldName], record, fieldSettings, 'full')}
        </FieldDisplay>
      )
    });

    return lines;
  }

  generate() {
    const { model, amon } = this.showSituation;
    const generator = this;

    let ShowComponent = customViewHelpers.getCustomComponent(this.showSituation, 'ShowDetails');
    if(!ShowComponent) {

      ShowComponent = class extends Polling {
        render() {
          const { changePage, data } = this.props;

          if (data.loading) {
            return (<div>Loading</div>)
          }

          if(!data[model.api.single]) {
            return (<div>Not found</div>)
          }

          const fields = generator.generateFields(this.props);

          return (<div>{fields}</div>);
        }
      }

    }

    const BindedComponent = this.bindReduxAndQueries(ShowComponent);

    // Add component to the maps of components to give the ability to use it somewhere else
    amon._addComponent(componentsNameGenerator.show(this.showSituation), BindedComponent);

    return BindedComponent;
  }

  bindReduxAndQueries(Component) {
    const { model, amon, combinedFields } = this.showSituation;

    const feedQuery = querySingleGenerator.generate(model.api.single, combinedFields, amon, 'show');

    return graphql(feedQuery, {
      options: ({ id }) => ({ variables: { id }})
    })(Component);
  }
}

export default ShowGenerator;
