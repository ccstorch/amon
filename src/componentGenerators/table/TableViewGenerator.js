import _ from 'lodash'
import React from 'react'
import TableGenerator from './TableGenerator'
import { PageHeader, RecordActionsDropdown } from '../../components'
import componentsNameGenerator from '../../helpers/componentsNameGenerator'
import customViewHelpers from '../../helpers/customViewHelpers'

console.log(customViewHelpers);

class TableViewGenerator {
  constructor(viewSituation) {
    this.viewSituation = viewSituation;
  }

  generate() {
    const { viewName, viewOptions, model, amon, combinedFields } = this.viewSituation;

    let ViewComponent = customViewHelpers.getCustomComponent(this.viewSituation, 'ListView');

    if(!ViewComponent) {

      let Header = customViewHelpers.getCustomComponent(this.viewSituation, 'ListHeader');
      if(!Header) Header = () => <PageHeader title={viewOptions.name} newPath={`/${viewOptions.url}/new`} />;

      const TableComponent = new TableGenerator(this.viewSituation).generate();

      ViewComponent = () => (
        <div>
          <Header />
          <TableComponent />
        </div>
      )

    }


    // Add component to the maps of components to give the ability to use it somewhere else
    amon._addView(viewName, ViewComponent, viewOptions.url);

    return ViewComponent;
  }
}

export default TableViewGenerator;
