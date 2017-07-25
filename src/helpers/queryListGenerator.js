import _ from 'lodash';
import { gql } from 'react-apollo';
import queryHelpers from './queryHelpers';

const helpers = {
  generate(queryName, fields, amon) {
    const feedQuery = gql`
      query {
        ${queryName}(orderBy: createdAt_DESC) {
          id
          ${queryHelpers.getFields(fields, amon)}
        }
      }
    `
    console.log(`${queryHelpers.getFields(fields, amon)}`);

    return feedQuery;
  }
}

export default helpers;
