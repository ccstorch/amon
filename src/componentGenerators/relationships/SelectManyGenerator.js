import _ from 'lodash';
import React from 'react'
import { Select } from 'antd';
import { gql, graphql } from 'react-apollo';
import Polling from '../_common/PollingSuperComponent'
import renderFieldsHelpers from '../../helpers/renderFieldsHelpers';
import queryListGenerator from '../../helpers/queryListGenerator';
import componentsNameGenerator from '../../helpers/componentsNameGenerator';

const { Option } = Select;

class SelectManyGenerator {
  constructor(modelSituation) {
    this.modelSituation = modelSituation;
  }

  generate() {
    const { model, amon } = this.modelSituation;

    _.forEach(model.fields, (field, key) => {
      // TODO: Move to a filter
      if(field.type === 'relationship' && field.relationshipType === 'oneToMany') {
        const relationModel = amon.getModel(field.model);
        const api = relationModel.api.list;

        // const fieldSituation = { ...this.modelSituation, api, relationModel };

        class SelectComponent extends Polling {
          render() {
            const { data } = this.props;

            if (data.loading) {
              return (<div>Loading</div>)
            }

            let list = [];
            if(data[api]) list = data[api].map((item) => Object.assign({}, item, { key: item.id }));

            let renderOption = field.getSelectData;
            if(!renderOption) renderOption = field.getSmallData;

            return (
              <Select mode="multiple" {...this.props}>
                {_.map(list, (item) =>(
                  <Option key={item.id} value={item.id}>{renderOption(item, null)}</Option>
                ))}
              </Select>
            );
          }
        }

        const BindedComponent = this.bindReduxAndQueries(SelectComponent, field, api);

        amon._addComponent(componentsNameGenerator.SelectManyModel(model, field, key), BindedComponent);
      }
    });


  }

  bindReduxAndQueries(Component, field, api) {
    const { amon, model } = this.modelSituation;
    const relationModel = amon.getModel(field.model);
    const feedQuery = queryListGenerator.generate(relationModel, field.requestedFields, amon);

    return graphql(feedQuery)(Component);
  }
}

export default SelectManyGenerator;
