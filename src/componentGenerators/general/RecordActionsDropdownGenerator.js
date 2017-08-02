import _ from 'lodash';
import React from 'react'
import { Modal } from 'antd';
import { gql, graphql } from 'react-apollo';
import RecordActionsDropdown from '../../components/RecordActionsDropdown';
import cacheHelpers from '../../helpers/cacheHelpers';
import componentsNameGenerator from '../../helpers/componentsNameGenerator';
import mutationDeleteGenerator from '../../helpers/mutationDeleteGenerator';

const { confirm } = Modal;

class RecordActionsDropdownGenerator {
  constructor(modelSituation) {
    this.modelSituation = modelSituation;
  }

  handleOnDelete({ mutate }) {
    const { model } = this.modelSituation;

    confirm({
      title: `Are you sure you want to delete this ${model.labels.single}?`,
      onOk() {
        mutate().then((response) => {
          // TODO: Show Notification
        });
      },
      onCancel() {},
    });
  }

  generate() {
    const { model, amon } = this.modelSituation;

    const Component = (props) => {
      return <RecordActionsDropdown {...props} onDelete={this.handleOnDelete.bind(this, props)} />;
    }

    const BindedComponent = this.bindReduxAndQueries(Component);

    amon._addComponent(componentsNameGenerator.recordActionsDropdown(model), BindedComponent);
  }

  bindReduxAndQueries(Component, field, api) {
    const { amon, model } = this.modelSituation;
    const deleteMutation = mutationDeleteGenerator.generate(model.api.delete);

    const cacheHandler = cacheHelpers.generateRemoveCacheHandler(this.modelSituation);

    return graphql(deleteMutation, {
      options: ({ id }) => ({ variables: { id } }),
      props: cacheHandler
    })(Component);
  }
}

export default RecordActionsDropdownGenerator;
