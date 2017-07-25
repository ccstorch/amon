import _ from 'lodash';
import React from 'react'
import { Select } from 'antd';
import { gql, graphql } from 'react-apollo';
import renderFieldsHelpers from '../../helpers/renderFieldsHelpers';
import queryListGenerator from '../../helpers/queryListGenerator';

const { Option } = Select;

class SelectsGenerator {
  constructor({ model, amon }) {
    this.model = model;
    this.amon = amon;
  }

  generate() {
    const { model, amon } = this;

    _.forEach(model.fields, (field, key) => {
      // TODO: Move to a filter
      if(field.type === 'relationship') {
        const relationModel = amon.getModel(field.model);
        const api = relationModel.api.list;

        const Component = (props) => {
          const { data } = props;

          if (data.loading) {
            return (<div>Loading</div>)
          }

          let list = [];
          if(data[api]) list = data[api].map((item) => Object.assign({}, item, { key: item.id }));

          const filter = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

          let renderOption = field.getSelectData;
          if(!renderOption) renderOption = field.getSmallData;

          return (
            <Select showSearch optionFilterProp="children" filterOption={filter} {...props}>
              {_.map(list, (item) =>(
                <Option key={item.id} value={item.id}>{renderOption(item, null)}</Option>
              ))}
            </Select>
          );
        }

        const BindedComponent = this.bindReduxAndQueries(Component, field, api);

        amon._addComponent(`${model.name}_${field.relatioshipType}_${key}_Select`, BindedComponent);
      }
    });


  }

  bindReduxAndQueries(Component, field, api) {
    const { amon } = this;
    const feedQuery = queryListGenerator.generate(api, field.requestedFields, amon);

    return graphql(feedQuery)(Component);
  }
}

export default SelectsGenerator;
