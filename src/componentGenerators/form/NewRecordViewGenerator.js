import React from 'react'
import { PageHeader } from '../../components'
import FormGenerator from './FormGenerator';

class NewRecordViewGenerator {
  constructor({ options, model, amon, combinedFields }) {
    this.options = options;
    this.model = model;
    this.amon = amon;
    this.combinedFields = combinedFields;
  }

  generate() {
    const { options, model, amon, combinedFields } = this;

    const FormComponent = new FormGenerator({ options, model, mutationName: model.api.create, amon, combinedFields }).generate();

    return () => (
      <div>
        <PageHeader title={'New ' + model.labels.single} showReturn />
        <FormComponent />
      </div>
    )
  }
}

export default NewRecordViewGenerator;
