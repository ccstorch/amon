import _ from 'lodash';
import configProviders from './configProviders';
import TableViewGenerator from './componentGenerators/table/TableViewGenerator';
import NewRecordViewGenerator from './componentGenerators/form/NewRecordViewGenerator';
import EditRecordViewGenerator from './componentGenerators/form/EditRecordViewGenerator';
import FormGenerator from './componentGenerators/form/FormGenerator';
import ModalFormGenerator from './componentGenerators/form/ModalFormGenerator';
import ShowRecordViewGenerator from './componentGenerators/show/ShowRecordViewGenerator';
import SelectGenerator from './componentGenerators/relationships/SelectGenerator';
import SelectWithFormGenerator from './componentGenerators/relationships/SelectWithFormGenerator';
import SelectManyGenerator from './componentGenerators/relationships/SelectManyGenerator';
import SelectManyWithFormGenerator from './componentGenerators/relationships/SelectManyWithFormGenerator';
import RecordActionsButtonsGenerator from './componentGenerators/general/RecordActionsButtonsGenerator';
import RecordActionsDropdownGenerator from './componentGenerators/general/RecordActionsDropdownGenerator';

// Starter point for the Amon framework
// All logic and settings starts from this class
class Amon {
  constructor({ models, views, styles, settings, menus, enums }) {
    this.models = models || {};
    this.views = views || {};
    this.styles = styles || {};
    this.settings = settings || {};
    this.menus = menus || {};
    this.enums = enums || {};
    this.queries = {};

    this.components = { common: {}, views: {} };

    this._prepareComponents();
    this._prepareViews();

    configProviders(this);

    console.log(this);
  }

  _prepareComponents() {
    _.forEach(this.models, (model) => {
      const modelSituation = { model, modelName: model.name, amon: this };

      new RecordActionsButtonsGenerator(modelSituation).generate();
      new RecordActionsDropdownGenerator(modelSituation).generate();

      const formSituation = { ...modelSituation, combinedFields: model.fields, location: 'form' }
      new FormGenerator({ ...formSituation, mutationName: model.api.create }).generate();
      new FormGenerator({ ...formSituation, mutationName: model.api.update, isUpdate: true }).generate();
      new ModalFormGenerator(modelSituation).generate();

      new SelectGenerator(modelSituation).generate();
      new SelectManyGenerator(modelSituation).generate();

      new SelectWithFormGenerator({ ...modelSituation, location: 'form' }).generate();
      new SelectManyWithFormGenerator({ ...modelSituation, location: 'form' }).generate();
    })
  }

  _prepareViews() {
    _.forEach(this.views, (viewOptions, modelName) => {
      const model = this.getModel(viewOptions.modelName);

      const combinedFields = {};
      _.forEach(viewOptions.fields, (field, fieldName) => {
        combinedFields[fieldName] = _.merge(model.fields[fieldName], field)
      });

      const viewName = viewOptions.name;

      const viewSituation = { model, modelName, viewName, combinedFields, viewOptions, amon: this };

      // TODO: Check type of view
      // Table
      new TableViewGenerator({ ...viewSituation, location: 'table', viewName }).generate();

      // New
      new NewRecordViewGenerator({ ...viewSituation, location: 'form', viewName: viewName + '_New', url: viewOptions.url + '/new' }).generate();

      // Edit
      new EditRecordViewGenerator({ ...viewSituation, location: 'form', viewName: viewName + '_Edit', url: viewOptions.url + '/:id/edit' }).generate();

      // Show
      new ShowRecordViewGenerator({ ...viewSituation, location: 'form', viewName: viewName + '_Show', url: viewOptions.url + '/:id/show' }).generate();
    })
  }

  _addComponent(name, Component) {
    this.components.common[name] = { Component }
  }

  _addView(name, Component, url) {
    this.components.views[name] = { Component, url }
  }

  _addQuery(model, query) {
    const queries = this.queries[model.name] || [];
    if(!queries.includes(query)) queries.push(query);
    this.queries[model.name] = queries;
  }

  _forEachQuery(modelName, callback) {
    const queries = this.queries[modelName] || [];
    queries.forEach((...params) => {
      try { callback(...params) } catch(e) {}
    });
  }

  getComponent(name) {
    return this.components.common[name];
  }

  getModel(name) {
    return _.find(this.models, (item) => item.name === name);
  }
}

export default Amon;
