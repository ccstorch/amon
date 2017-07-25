import _ from 'lodash';
import React from 'react'
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Table, Dropdown, Icon, Menu } from 'antd';
import { gql, graphql } from 'react-apollo';
import fieldsDisplayConditionsHelpers from '../../helpers/fieldsDisplayConditionsHelpers';
import renderFieldsHelpers from '../../helpers/renderFieldsHelpers';
import queryListGenerator from '../../helpers/queryListGenerator';
import { RecordActionsDropdown } from '../../components'

class TableGenerator {
  constructor({ options, model, amon, combinedFields }) {
    this.options = options;
    this.model = model;
    this.amon = amon;
    this.combinedFields = combinedFields;
  }

  generateColumns(props) {
    const { options, model, combinedFields } = this;
    const { changePage, data } = props;

    let firstCol = true;
    const columns = [];
    _.forEach(combinedFields, (item, key, index) => {
      if(!fieldsDisplayConditionsHelpers.shouldShowField(item, 'table')) return;

      const fieldSettings = _.result(model, `fields.${key}`, {});
      const title = _.result(fieldSettings, 'label', key);
      const render = (text, record) => renderFieldsHelpers.render(text, record, fieldSettings);

      const columnObj = {
        key,
        title,
        render,
        dataIndex: key,
      };

      if(firstCol) {
        columnObj.render = (text, record) => <Link to={`/${options.url}/${record.id}/show`}>{render(text, record)}</Link>;
        firstCol = false;
      }

      columns.push(columnObj);
    });

    columns.push({
      title: 'Actions',
      key: 'action',
      render: (text, record) => <RecordActionsDropdown record={record} url={options.url} />
    });

    return columns;
  }

  generate() {
    const { options, model } = this;

    const Component = (props) => {
      const { changePage, data } = props;

      if (data.loading) {
        return (<div>Loading</div>)
      }

      const columns = this.generateColumns(props);

      let list = [];
      if(data[model.api.list]) list = data[model.api.list].map((item) => Object.assign({}, item, { key: item.id }));

      return (
        <Table columns={columns} dataSource={list} size="middle" />
      );
    }

    return this.bindReduxAndQueries(Component);
  }

  bindReduxAndQueries(Component) {
    const { options, model, amon, combinedFields } = this;

    const mapDispatchToProps = (dispatch) => bindActionCreators({
      changePage: (url) => push(url)
    }, dispatch)

    const feedQuery = queryListGenerator.generate(model.api.list, combinedFields, amon);

    return connect(null, mapDispatchToProps)(
      graphql(feedQuery)(Component)
    );
  }
}

export default TableGenerator;
