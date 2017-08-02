import _ from 'lodash';
import { gql } from 'react-apollo';
import fieldsDisplayConditionsHelpers from './fieldsDisplayConditionsHelpers';

const helpers = {
  getFields(fields, amon, location) {
    return _.map(fields, (item, key) => (
      this.getFieldData(item, key, amon, location)
    ))
  },

  getFieldData(field, fieldName, amon, location) {
    if(!!location && !fieldsDisplayConditionsHelpers.shouldShowField({ field, location })) return '';

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
