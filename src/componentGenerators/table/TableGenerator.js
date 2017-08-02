import _ from 'lodash';
import React, { Component } from 'react'
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { setParams } from '../../redux/filtersActions'
import store from '../../store'
import { connect } from 'react-redux'
import { Table, Dropdown, Icon, Menu } from 'antd';
import { gql, graphql } from 'react-apollo';
import fieldsDisplayConditionsHelpers from '../../helpers/fieldsDisplayConditionsHelpers';
import renderFieldsHelpers from '../../helpers/renderFieldsHelpers';
import queryListGenerator from '../../helpers/queryListGenerator';
import customViewHelpers from '../../helpers/customViewHelpers'
import componentsNameGenerator from '../../helpers/componentsNameGenerator'
import Polling from '../_common/PollingSuperComponent'
import { RecordActionsDropdown } from '../../components'

const PAGE_SIZE = 10;
const defaultVariables = {
  skip: 0,
  orderBy: 'createdAt_DESC',
}

class TableGenerator {
  constructor(viewSituation) {
    this.viewSituation = viewSituation;
  }

  generateColumns(props, component) {
    const { viewOptions, model, combinedFields, amon } = this.viewSituation;
    const { changePage, filterState } = props;

    const { Component: ActionsDropdown } = amon.getComponent(componentsNameGenerator.recordActionsDropdown(model));

    let firstCol = true;
    const columns = [];
    _.forEach(combinedFields, (field, fieldName, index) => {
      const fieldSituation = { ...this.viewSituation, field, fieldName, index };

      if(!fieldsDisplayConditionsHelpers.shouldShowField(fieldSituation)) return;

      const fieldSettings = _.result(model, `fields.${fieldName}`, {});
      const title = _.result(fieldSettings, 'label', fieldName);
      const render = (text, record) => renderFieldsHelpers.render(text, record, fieldSettings);

      const columnObj = {
        key: fieldName,
        title,
        render,
        sorter: field.type !== 'relationship',
        dataIndex: fieldName,
        sortOrder: _.result(filterState, 'sorter.columnKey') === fieldName && _.result(filterState, 'sorter.order')
      };

      if(firstCol) {
        columnObj.render = (text, record) => <Link to={`/${viewOptions.url}/${record.id}/show`}>{render(text, record)}</Link>;
        firstCol = false;
      }

      columns.push(columnObj);
    });

    columns.push({
      title: 'Actions',
      key: 'action',
      render: (text, record) => <ActionsDropdown id={record.id} url={viewOptions.url} />
    });

    return columns;
  }

  generate() {
    const { model, amon } = this.viewSituation;
    const self = this;

    let TableComponent = customViewHelpers.getCustomComponent(this.viewSituation, 'ListTable');
    if(!TableComponent) {

      TableComponent = class extends Polling {
        constructor(props) {
          super(props);
          this.handleChange = this.handleChange.bind(this);
          this.refetch = this.refetch.bind(this);
        }

        refetch(page = 0, filters = {}, sorter = {}) {
          const { data, setParams, filterState } = this.props;
          const orderBy = sorter.columnKey ? `${sorter.columnKey}_${sorter.order === 'descend' ? 'DESC' : 'ASC'}` : filterState.orderBy;
          const skip = PAGE_SIZE * (page - 1);

          setParams({ skip, orderBy, page, filters, sorter });
          data.refetch({ skip, orderBy, filters });
        }

        handleChange(pagination, filters, sorter) {
          this.refetch(pagination.current, filters, sorter);
        }

        render() {
          const { changePage, data, filterState } = this.props;

          const columns = self.generateColumns(this.props, this);

          let list = [];
          let total = 0;
          if(data[model.api.list]) {
            list = data[model.api.list].map((item) => Object.assign({}, item, { key: item.id }));
            total = data[`_${model.api.list}Meta`].count;
          }

          const pagination = { current: filterState.page, total };

          return (
            <Table
              pagination={pagination}
              rowKey={(record) => record.id}
              columns={columns}
              dataSource={list}
              loading={data.loading || filterState.loading}
              onChange={this.handleChange}
              size="middle" />
          );
        }
      }

    }

    const BindedComponent = this.bindReduxAndQueries(TableComponent);

    // Add component to the maps of components to give the ability to use it somewhere else
    amon._addComponent(componentsNameGenerator.table(this.viewSituation), BindedComponent);

    return BindedComponent;
  }

  bindReduxAndQueries(Component) {
    const { viewName, model, amon, combinedFields } = this.viewSituation;

    const mapStateToProps = (state) => ({
      filterState: state.filters[viewName] || { ...defaultVariables },
    });

    const mapDispatchToProps = (dispatch) => bindActionCreators({
      changePage: (url) => push(url),
      setParams: (params) => setParams(viewName, params)
    }, dispatch)

    const feedQuery = queryListGenerator.generate(model, combinedFields, amon, 'table');

    return (
      graphql(feedQuery, {
        options: (props) => ({
          variables: { ...defaultVariables, ...(store.getState().filters[viewName] || {}) }
        })
      })(
        connect(mapStateToProps, mapDispatchToProps)(Component)
      )
    );
  }
}

export default TableGenerator;
