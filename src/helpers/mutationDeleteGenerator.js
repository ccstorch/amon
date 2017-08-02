import _ from 'lodash';
import { gql } from 'react-apollo';

const helpers = {
  generate(mutationName) {
    const deleteQuery = gql`
      mutation delete ($id: ID!) {
        ${mutationName}(id: $id) {
          id
        }
      }
    `

    return deleteQuery;
  }
}

export default helpers;
