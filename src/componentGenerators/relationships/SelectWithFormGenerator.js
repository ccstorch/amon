import _ from 'lodash';
import React, { Component } from 'react'
import { Select, Icon } from 'antd';
import { gql, graphql } from 'react-apollo';
import renderFieldsHelpers from '../../helpers/renderFieldsHelpers';
import queryListGenerator from '../../helpers/queryListGenerator';
import mutationGenerator from '../../helpers/mutationGenerator';
import componentsNameGenerator from '../../helpers/componentsNameGenerator';
import ModalFormGenerator from '../form/ModalFormGenerator';

const { Option } = Select;

class SelectWithFormGenerator {
  constructor(modelSituation) {
    this.modelSituation = modelSituation;
  }

  generate() {
    const { model, amon } = this.modelSituation;

    _.forEach(model.fields, (field, fieldName) => {
      // TODO: Move to a filter
      if(field.type === 'relationship' && field.relationshipType === 'manyToOne') {
        const relationModel = amon.getModel(field.model);
        const api = relationModel.api.list;

        const fieldSituation = { ...this.modelSituation, field, relationModel, api, fieldName };

        const { Component: Select } = amon.getComponent(componentsNameGenerator.SelectModel(model, field, fieldName));

        // Invert the model and relationModel for the form generation
        const combinedFields = _.omitBy(relationModel.fields, (field) => field.model === model.name);
        const formSituation = { ...fieldSituation, model: relationModel, relationModel: model, mutationName: relationModel.api.create, combinedFields };
        const Modal = new ModalFormGenerator(formSituation).generate();

        class GeneratedComponent extends Component {
          constructor(props) {
            super(props);
            this.state = { formModalVisible: false };
          }

          handleSubmit(formSituation, formProps, newRecord) {
            const finalFieldName = mutationGenerator.getFieldName(field, fieldName);
            const { parentForm } = this.props;
            parentForm.setFieldsValue({ [finalFieldName]: newRecord.id });
          }

          render() {
            const { data } = this.props;
            const { formModalVisible } = this.state;

            const closeForm = () => this.setState({ formModalVisible: false });
            const openForm = () => this.setState({ formModalVisible: true });

            return (
              <div>
                <Select {...this.props} />
                <a onClick={openForm}>
                  <Icon type="plus-circle-o" style={{ marginRight: 5 }} />
                  Create new {relationModel.labels.single}
                </a>
                <Modal visible={formModalVisible} onCancel={closeForm} onSuccess={this.handleSubmit.bind(this)} />
              </div>
            );
          }
        }

        amon._addComponent(componentsNameGenerator.SelectModelWithForm(fieldSituation), GeneratedComponent);
      }
    });


  }
}

export default SelectWithFormGenerator;
