import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd';
import { gql, graphql } from 'react-apollo';
import { PageHeader } from '../../components'
import FormGenerator from './FormGenerator';
import querySingleGenerator from '../../helpers/querySingleGenerator';
import componentsNameGenerator from '../../helpers/componentsNameGenerator'
import customViewHelpers from '../../helpers/customViewHelpers'

class EditRecordViewGenerator {
  constructor(viewSituation) {
    this.viewSituation = viewSituation;
  }

  generate() {
    const { viewOptions, model, url, viewName, amon } = this.viewSituation;

    const formSituation = { ...this.viewSituation, mutationName: model.api.update, isUpdate: true };

    let ViewComponent = customViewHelpers.getCustomComponent(formSituation, 'EditView');

      if(!ViewComponent) {

      let Header = customViewHelpers.getCustomComponent(formSituation, 'EditHeader');
      if(!Header) Header = () => <PageHeader title={'Edit ' + model.labels.single} showReturn />;

      const FormComponent = new FormGenerator(formSituation).generate();

      ViewComponent =  ({ match, data }) => {
        const { id } = match.params;

        return (
          <div>
            <Header />
            <FormComponent id={id} />
          </div>
        )
      }

    }

    // Add component to the maps of components to give the ability to use it somewhere else
    amon._addView(viewName, ViewComponent, url);

    return ViewComponent;
  }
}

export default EditRecordViewGenerator;
