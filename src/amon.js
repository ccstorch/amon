import _ from 'lodash';
import configProviders from './configProviders';
import TableGenerator from './componentGenerators/table/TableGenerator';
import TableViewGenerator from './componentGenerators/table/TableViewGenerator';
import NewRecordViewGenerator from './componentGenerators/form/NewRecordViewGenerator';
import EditRecordViewGenerator from './componentGenerators/form/EditRecordViewGenerator';
import ShowRecordViewGenerator from './componentGenerators/show/ShowRecordViewGenerator';
import SelectsGenerator from './componentGenerators/relationships/SelectsGenerator';

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

    this.components = { common: {}, views: {} };

    this._prepareComponents();
    this._prepareViews();

    configProviders(this);
  }

  _prepareComponents() {
    _.forEach(this.models, (model, key) => {
      new SelectsGenerator({ model, amon: this }).generate();
    })
  }

  _prepareViews() {
    _.forEach(this.views, (options, modelName) => {
      const model = this.getModel(options.modelName);

      const combinedFields = {};
      _.forEach(options.fields, (field, fieldName) => {
        combinedFields[fieldName] = _.merge(model.fields[fieldName], field)
      });

      const viewName = options.name;

      // TODO: Check type of view
      // Table
      const TableView = new TableViewGenerator({ options, model, combinedFields, amon: this }).generate();
      this._addView(viewName, TableView, options.url);

      // New
      const NewRecordView = new NewRecordViewGenerator({ options, model, combinedFields, amon: this }).generate();
      this._addView(viewName + '_New', NewRecordView, options.url + '/new');

      // Edit
      const EditRecordView = new EditRecordViewGenerator({ options, model, combinedFields, amon: this }).generate();
      this._addView(viewName + '_Edit', EditRecordView, options.url + '/:id/edit');

      // Show
      const ShowRecordView = new ShowRecordViewGenerator({ options, model, combinedFields, amon: this }).generate();
      this._addView(viewName + '_Show', ShowRecordView, options.url + '/:id/show');
    })
  }

  _addComponent(name, Component) {
    this.components.common[name] = { Component }
  }

  _addView(name, Component, url) {
    this.components.views[name] = { Component, url }
  }

  getComponent(name) {
    return this.components.common[name];
  }

  getModel(name) {
    return _.find(this.models, (item) => item.name === name);
  }
}

export default Amon;
