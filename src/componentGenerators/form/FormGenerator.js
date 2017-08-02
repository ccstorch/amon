import _ from 'lodash';
import React from 'react'
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd';
import { gql, graphql } from 'react-apollo';
import apollo from '../../apollo';
import fieldsDisplayConditionsHelpers from '../../helpers/fieldsDisplayConditionsHelpers';
import renderInputsHelpers from '../../helpers/renderInputsHelpers';
import mutationGenerator from '../../helpers/mutationGenerator';
import querySingleGenerator from '../../helpers/querySingleGenerator';
import cacheHelpers from '../../helpers/cacheHelpers';
import componentsNameGenerator from '../../helpers/componentsNameGenerator'
import mutationSubmitionsHandler from '../../helpers/mutationSubmitionsHandler'
import customViewHelpers from '../../helpers/customViewHelpers'

const FormItem = Form.Item;

class FormGenerator {
  constructor(formSituation) {
    this.formSituation = formSituation;
  }

  generateInputs(props) {
    const { model, amon, combinedFields } = this.formSituation;
    const { changePage, data, form, locale } = props;
    const record = data && data[model.api.single];

    const inputs = [];
    _.forEach(combinedFields, (field, fieldName, index) => {
      const fieldSituation = { ...this.formSituation, field, fieldName, index };

      if(!fieldsDisplayConditionsHelpers.shouldShowField(fieldSituation)) return;

      let initialValue = renderInputsHelpers.getInitialFieldValueData(record, fieldSituation);

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

  handleSubmit(props, event) {
    event.preventDefault();
    mutationSubmitionsHandler.handle(this.formSituation, props, props.onSuccess);
  }

  generate() {
    const { model, amon, isUpdate } = this.formSituation;

    let FormComponent = customViewHelpers.getCustomComponent(this.formSituation, isUpdate ? 'EditForm' : 'NewForm');
    if(!FormComponent) {

      FormComponent = (props) => {
        const { data, id, hideSubmit } = props;

        if (!!id && data.loading) {
          return (<div>Loading</div>)
        }

        if(!!id && !data[model.api.single]) {
          return (<div>Not found</div>)
        }

        const inputs = this.generateInputs(props);

        return (
          <Form layout="vertical" style={{ maxWidth: 500 }} onSubmit={this.handleSubmit.bind(this, props)}>
            {inputs}
            {!hideSubmit &&
              <FormItem>
                <Button type="primary" htmlType="submit" ghost>Register</Button>
              </FormItem>
            }
          </Form>
        );
      }

    }

    const BindedComponent = this.bindReduxAndQueries(FormComponent);

    // Add component to the maps of components to give the ability to use it somewhere else
    amon._addComponent(componentsNameGenerator.Form(this.formSituation), BindedComponent);

    return BindedComponent;
  }

  bindReduxAndQueries(Component) {
    const { model, mutationName, isUpdate, amon, combinedFields } = this.formSituation;

    const mapDispatchToProps = (dispatch) => bindActionCreators({
      changePage: (url) => push(url)
    }, dispatch)

    const feedQuery = querySingleGenerator.generate(model.api.single, combinedFields, amon);

    const createMutation = mutationGenerator.generate(mutationName, model, isUpdate, amon);

    const handleCache = cacheHelpers.generateListCacheHandler(this.formSituation);

    return connect(null, mapDispatchToProps)(
      Form.create()(
        graphql(createMutation, { props: handleCache })(
          !isUpdate ? Component : graphql(feedQuery, { options: ({ id }) => (!!id ? { variables: { id }} : {})})(Component)
        )
      )
    );
  }
}

export default FormGenerator;
