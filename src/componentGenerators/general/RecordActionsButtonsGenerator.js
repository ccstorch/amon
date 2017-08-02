import _ from 'lodash';
import React from 'react'
import { Modal } from 'antd';
import { gql, graphql } from 'react-apollo';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import RecordActionsButtons from '../../components/RecordActionsButtons';
import cacheHelpers from '../../helpers/cacheHelpers';
import componentsNameGenerator from '../../helpers/componentsNameGenerator';
import mutationDeleteGenerator from '../../helpers/mutationDeleteGenerator';

const { confirm } = Modal;

class RecordActionsButtonsGenerator {
  constructor(modelSituation) {
    this.modelSituation = modelSituation;
  }

  handleOnDelete({ url, mutate, changePage }) {
    const { model } = this.modelSituation;

    confirm({
      title: `Are you sure you want to delete this ${model.labels.single}?`,
      onOk() {
        mutate().then((response) => {
          changePage(`/${url}/`);
          // TODO: Show Notification
        });
      },
      onCancel() {},
    });
  }

  generate() {
    const { model, amon } = this.modelSituation;

    const Component = (props) => {
      return <RecordActionsButtons {...props} onDelete={this.handleOnDelete.bind(this, props)} />;
    }

    const BindedComponent = this.bindReduxAndQueries(Component);

    amon._addComponent(componentsNameGenerator.recordActionsButtons(model), BindedComponent);
  }

  bindReduxAndQueries(Component, field, api) {
    const { amon, model } = this.modelSituation;
    const deleteMutation = mutationDeleteGenerator.generate(model.api.delete);

    const cacheHandler = cacheHelpers.generateRemoveCacheHandler(this.modelSituation);

    const mapDispatchToProps = (dispatch) => bindActionCreators({
      changePage: (url) => push(url)
    }, dispatch)

    return connect(null, mapDispatchToProps)(
      graphql(deleteMutation, {
        options: ({ id }) => ({ variables: { id } }),
        props: cacheHandler
      })(Component)
    );
  }
}

export default RecordActionsButtonsGenerator;
