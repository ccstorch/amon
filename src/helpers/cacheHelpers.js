import _ from 'lodash';
import queryListGenerator from './queryListGenerator';

const helpers = {
  generateListCacheHandler(formSituation) {
    const { model, mutationName, isUpdate, amon, combinedFields } = formSituation;

    const cacheName = model.api.list;

    const listFeedQuery = queryListGenerator.generate(model, combinedFields, amon, 'table');

    return ({ mutate: save }) => {
      return {
        mutate({ variables }) {
          return save({
            variables: variables,
            update: (store, { data }) => {
              if(!!isUpdate) return;
              amon._forEachQuery(model.name, (query) => {
                const cache = store.readQuery({ query: query });
                cache[cacheName].unshift(data.createPost);
                store.writeQuery({ query: query, data: cache });
              });
            },
          });
        },
      };
    }
  },

  generateRemoveCacheHandler(modelSituation) {
    const { model, amon } = modelSituation;

    const cacheName = model.api.list;
    const deleteName = model.api.delete;

    const listFeedQuery = queryListGenerator.generate(model, model.fields, amon, 'table');

    return ({ mutate: remove }) => {
      return {
        mutate() {
          return remove({
            update: (store, { data }) => {
              const { id } = data[deleteName];
              amon._forEachQuery(model.name, (query) => {
                const cache = store.readQuery({ query: query });
                _.remove(cache[cacheName], (item) => item.id === id);
                store.writeQuery({ query: query, data: cache });
              });
            },
          });
        },
      };
    }
  }
}

export default helpers;
