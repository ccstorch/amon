import _ from 'lodash';
import React, { Component } from 'react'
import { Modal } from 'antd';
import { gql, graphql } from 'react-apollo';
import componentsNameGenerator from '../../helpers/componentsNameGenerator';
import mutationSubmitionsHandler from '../../helpers/mutationSubmitionsHandler';
import FormGenerator from './FormGenerator';

class ModalFormGenerator {
  constructor(fieldSituation) {
    this.fieldSituation = fieldSituation;
  }

  generate() {
    const { model, amon, relationModel } = this.fieldSituation;

    let ModelForm;
    if(!!relationModel) {
      ModelForm = new FormGenerator(this.fieldSituation).generate();
    } else {
      ModelForm = amon.getComponent(componentsNameGenerator.Form(this.fieldSituation)).Component;
    }

    const ModalComponent = (props) => {
      const { visible, onCancel, onSuccess } = props;

      const handleSubmit = (formSituation, props, newRecord) => {
        onCancel();
        if(!!onSuccess) onSuccess(formSituation, props, newRecord);
      }

      return (
        <Modal visible={visible} title={`Create a new ${model.labels.single}`}  onCancel={onCancel} footer={false}>
          <ModelForm {...props} onSuccess={handleSubmit} />
        </Modal>
      );
    }

    amon._addComponent(componentsNameGenerator.FormModal(this.fieldSituation), ModalComponent);

    return ModalComponent;
  }
}

export default ModalFormGenerator;
