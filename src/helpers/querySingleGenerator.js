import _ from 'lodash';
import { gql } from 'react-apollo';
import queryHelpers from './queryHelpers';

const helpers = {
  generate(queryName, fields, amon) {
    const feedQuery = gql`
      query single($id: ID!){
        ${queryName}(id: $id) {
          id
          ${queryHelpers.getFields(fields, amon)}
        }
      }
    `

    return feedQuery;
  }
}

export default helpers;
