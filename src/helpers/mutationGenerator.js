import _ from 'lodash';
import { gql } from 'react-apollo';

const helpers = {
  getFieldType(field) {
    // TODO: Check types
    switch (field.type) {
      case 'boolean': return 'Boolean';
      case 'integer': return 'Int';
      case 'float': return 'Float';
      case 'double': return 'Float';
      case 'enum': return field.enum;
      case 'relationship': return 'ID';
      default: return 'String';
    }
  },

  getFieldName(field, name) {
    // TODO: Check types
    switch (field.type) {
      case 'relationship': return name+'Id';
      default: return name;
    }
  },

  processFields(model, isUpdate) {
    let mutationDeclarations = [];
    let mutationParams = [];
    let fieldsReturned = ['id'];

    if(isUpdate) {
      mutationDeclarations.push('$id: ID!');
      mutationParams.push('id: $id');
    }

    _.forEach(model.fields, (field, key) => {
      const fieldName = this.getFieldName(field, key);
      let declaration = `$${fieldName}: ${this.getFieldType(field)}`;
      if(field.required) declaration += '!';
      const param = `${fieldName}: $${fieldName}`;

      mutationDeclarations.push(declaration);
      mutationParams.push(param);
      // TODO: Fetch nested data
      if(field.type !== 'relationship') fieldsReturned.push(key);
    });

    return {
      declarations: mutationDeclarations.join(', '),
      params: mutationParams.join(', '),
      fieldsReturned: fieldsReturned.join('\n'),
    }
  },

  generate(mutationName, model, isUpdate, amon) {
    const { declarations, params, fieldsReturned } = this.processFields(model, isUpdate, amon);

    const createQuery = gql`
      mutation (${declarations}) {
        ${mutationName}(${params}) {
          ${fieldsReturned}
        }
      }
    `

    return createQuery;
  }
}

export default helpers;
