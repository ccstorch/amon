import _ from 'lodash';
import { gql } from 'react-apollo';
import queryHelpers from './queryHelpers';

const helpers = {
  generate(queryName, fields, amon, location) {
    const feedQuery = gql`
      query single($id: ID!){
        ${queryName}(id: $id) {
          id
          ${queryHelpers.getFields(fields, amon, location)}
        }
      }
    `

    return feedQuery;
  }
}

export default helpers;
