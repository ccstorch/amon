import React from 'react'
import { Form, Input, Button } from 'antd';
import { PageHeader, RecordActionsButtons } from '../../components'
import ShowGenerator from './ShowGenerator';
import querySingleGenerator from '../../helpers/querySingleGenerator';
import componentsNameGenerator from '../../helpers/componentsNameGenerator'
import customViewHelpers from '../../helpers/customViewHelpers'

class ShowRecordViewGenerator {
  constructor(viewSituation) {
    this.viewSituation = viewSituation;
  }

  generate() {
    const { viewOptions, viewName, url, model, amon, combinedFields } = this.viewSituation;

    const showSituation = { ...this.viewSituation };

    const ShowComponent = new ShowGenerator(showSituation).generate();

    const { Component: ActionsButtons } = amon.getComponent(componentsNameGenerator.recordActionsButtons(model));

    let ViewComponent = customViewHelpers.getCustomComponent(showSituation, 'ShowView');

    if(!ViewComponent) {

      let Header = customViewHelpers.getCustomComponent(showSituation, 'ShowHeader');
      if(!Header) {
        Header = ({ actions }) => <PageHeader title={model.labels.single} showReturn rightContent={actions} />;
      }

      ViewComponent =  ({ match, data }) => {
        const { id } = match.params;

        const actions = (
          <div style={{ float: 'right' }}>
            <ActionsButtons id={id} url={viewOptions.url} />
          </div>
        );

        return (
          <div>
            <Header actions={actions} />
            <ShowComponent id={id} />
          </div>
        )
      }

    }

    // Add component to the maps of components to give the ability to use it somewhere else
    amon._addView(viewName, ViewComponent, url);

    return ViewComponent;
  }
}

export default ShowRecordViewGenerator;
