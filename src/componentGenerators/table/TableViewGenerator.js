import React from 'react'
import TableGenerator from './TableGenerator'
import { PageHeader, RecordActionsDropdown } from '../../components'

class TableViewGenerator {
  constructor({ options, model, amon, combinedFields }) {
    this.options = options;
    this.model = model;
    this.amon = amon;
    this.combinedFields = combinedFields;
  }

  generate() {
    const { options, model, amon, combinedFields } = this;

    const TableComponent = new TableGenerator({ options, model, combinedFields, amon }).generate();

    return () => (
      <div>
        <PageHeader title={options.name} newPath={`/${options.url}/new`} />
        <TableComponent />
      </div>
    )
  }
}

export default TableViewGenerator;
