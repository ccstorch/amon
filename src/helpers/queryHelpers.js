import _ from 'lodash';
import { gql } from 'react-apollo';

const helpers = {
  getFields(fields, amon) {
    return _.map(fields, (item, key) => (
      this.getFieldData(item, key, amon)
    ))
  },

  getFieldData(field, fieldName, amon) {
    if(field.type === 'relationship') {
      const relationModel = amon.getModel(field.model);
      return `
        ${fieldName} {
          id
          ${this.getFields(field.requestedFields || relationModel.fields)}
        }
      `;
    }
    return fieldName;
  }
}

export default helpers;
