import _ from 'lodash';
import { gql } from 'react-apollo';
import queryHelpers from './queryHelpers';

const helpers = {
  generate(model, fields, amon, location) {
    const queryName = model.api.list;
    const limitStatement = location === 'table' ? `, first: 10` : '';

    const feedQuery = gql`
      query($skip: Int = 0, $orderBy: ${model.name}OrderBy = createdAt_DESC) {
        ${queryName}(orderBy: $orderBy ${limitStatement}, skip: $skip) {
          id
          ${queryHelpers.getFields(fields, amon, location)}
        }
        _${queryName}Meta {
          count
        }
      }
    `

    amon._addQuery(model, feedQuery);

    return feedQuery;
  }
}

export default helpers;
