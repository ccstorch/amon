import _ from 'lodash';

const f = (name) => _.upperFirst(_.camelCase(name));

const helpers = {
  recordActionsDropdown(model) {
    return `${f(model.name)}ActionsDropdown`;
  },
  recordActionsButtons(model) {
    return `${f(model.name)}ActionsButtons`;
  },
  SelectModel(model, field, fieldName) {
    return `${f(model.name)}${f(field.relationshipType)}${f(fieldName)}Select`;
  },
  SelectModelWithForm({ model, field, fieldName }) {
    return `${f(model.name)}${f(field.relationshipType)}${f(fieldName)}SelectWithForm`;
  },
  InputWrapperWithForm({ model, field, fieldName }) {
    return `${f(model.name)}${f(field.relationshipType)}${f(fieldName)}InputWrapperWithForm`;
  },
  SelectManyModel(model, field, fieldName) {
    return `${f(model.name)}${f(field.relationshipType)}${f(fieldName)}SelectMany`;
  },
  SelectManyModelWithForm({ model, field, fieldName }) {
    return `${f(model.name)}${f(field.relationshipType)}${f(fieldName)}SelectManyWithForm`;
  },
  table(tableSituation) {
    return `${f(tableSituation.viewOptions.name)}Table`;
  },
  Form(formSituation) {
    const { viewOptions, field, isUpdate, model, fieldName, relationModel } = formSituation;
    let initialName = isUpdate ? 'Edit' : 'New';
    if(viewOptions) {
      return `${initialName}${f(viewOptions.name)}Form`;
    }
    if(field) {
      return `${f(fieldName)}${f(field.relationshipType)}${f(relationModel.name)}sForm`;
    }
    return `${initialName}General${f(model.name)}Form`;
  },
  FormModal(formSituation) {
    const { viewOptions, isUpdate, model } = formSituation;
    let initialName = isUpdate ? 'Edit' : 'New';
    if(viewOptions) {
      return `${initialName}${f(viewOptions.name)}ModalForm`;
    }
    return `${initialName}General${f(model.name)}ModalForm`;
  },
  show(showSituation) {
    return `Show${f(showSituation.viewOptions.name)}`;
  },
}

export default helpers;
