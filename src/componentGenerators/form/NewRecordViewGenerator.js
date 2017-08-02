import React from 'react'
import { PageHeader } from '../../components'
import FormGenerator from './FormGenerator'
import componentsNameGenerator from '../../helpers/componentsNameGenerator'
import customViewHelpers from '../../helpers/customViewHelpers'

class NewRecordViewGenerator {
  constructor(viewSituation) {
    this.viewSituation = viewSituation;
  }

  generate() {
    const { viewOptions, viewName, model, url, amon } = this.viewSituation;

    const formSituation = { ...this.viewSituation, mutationName: model.api.create };

    let ViewComponent = customViewHelpers.getCustomComponent(formSituation, 'NewView');

    if(!ViewComponent) {

      let Header = customViewHelpers.getCustomComponent(formSituation, 'NewHeader');
      if(!Header) Header = () => <PageHeader title={'New ' + model.labels.single} showReturn />;

      const FormComponent = new FormGenerator(formSituation).generate();

      ViewComponent = () => (
        <div>
          <Header />
          <FormComponent />
        </div>
      )

    }

    // Add component to the maps of components to give the ability to use it somewhere else
    amon._addView(viewName, ViewComponent, url);

    return ViewComponent;
  }
}

export default NewRecordViewGenerator;
