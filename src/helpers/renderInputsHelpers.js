import _ from 'lodash';
import React from 'react';
import moment from 'moment';
import mutationGenerator from './mutationGenerator';
import componentsNameGenerator from './componentsNameGenerator';
import { Form, Input, Button, Upload, Icon, message, DatePicker, Select, InputNumber } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;

const helpers = {
  setFieldValue(form, fieldName, value) {
    form.setFieldsValue({ [fieldName]: value });
  },

  getInitialFieldValueData(record, fieldSituation) {
    const { field, fieldName } = fieldSituation;

    if(!!record && record[fieldName]) {
      if(field.type === 'relationship') {
        if(field.relationshipType === 'oneToMany' || field.relationshipType === 'manyToMany') {
          return _.map(record[fieldName], (item) => item.id);
        }
        return record[fieldName].id;
      }
      return record[fieldName];
    }
  },

  getWrapper() {
    return ({ children }) => <div>{children}</div>;
  },

  render({ key, field, form, initialValue, model, amon }) {
    const { getFieldDecorator } = form;
    const Wrapper = this.getWrapper();

    const fieldDecoratorOptions = {};
    if(!!initialValue) fieldDecoratorOptions.initialValue = initialValue;

    const wrapperProps = {
      key,
      label: field.label,
      hasFeedback: true,
    };

    let options = field.options;

    let fieldType = field.type;
    if(fieldType === 'enum') {
      fieldType = 'select';
      options = amon.enums[field.enum];
    }

    switch (fieldType) {
      case 'date':
        const dateFormat = !field.format || field.format === 'fromNow' ? 'DD/MM/YYYY' : field.format;
        return (
          <FormItem {...wrapperProps} hasFeedback={false}>
            {getFieldDecorator(key, {
              ...fieldDecoratorOptions,
              rules: [{ type: 'object', required: true, message: 'Invalid' }],
            })(
              <DatePicker format={dateFormat} placeholder='' />
            )}
          </FormItem>
        );

      case 'imageUrl':
        const props = {
          name: key,
          action: '//jsonplaceholder.typicode.com/posts/',
          headers: {
            authorization: 'authorization-text',
          },
          onChange(info) {
            if (info.file.status === 'uploading') {
              console.log(2, info);
            }
            if (info.file.status === 'done') {
              message.success(`${info.file.name} file uploaded successfully`);
              this.setFieldValue(form, key, 'TODO');
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
              this.setFieldValue(form, key, 'TODO');
            }
          },
        };

        return (
          <FormItem {...wrapperProps} hasFeedback={false}>
            {getFieldDecorator(key, {
              ...fieldDecoratorOptions,
              rules: [{ type: 'string', required: true, message: 'Invalid' }],
            })(
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> Click to Upload
                </Button>
              </Upload>
            )}
          </FormItem>
        )

      case 'text':
        return (
            <FormItem {...wrapperProps}>
              {getFieldDecorator(key, {
                ...fieldDecoratorOptions,
                rules: [{
                  type: 'string', message: 'Invalid',
                }, {
                  required: field.required, message: 'Required',
                }],
              })(
                <TextArea autosize={{ minRows: 2, maxRows: 12 }} />
              )}
            </FormItem>
        );

      case 'integer':
        return (
          <FormItem {...wrapperProps}>
            {getFieldDecorator(key, {
              ...fieldDecoratorOptions,
              rules: [{
                type: 'number', message: 'Invalid',
              }, {
                required: field.required, message: 'Required',
              }],
            })(
              <InputNumber />
            )}
          </FormItem>
        );

      case 'select':
        return (
          <FormItem {...wrapperProps} hasFeedback={false}>
            {getFieldDecorator(key, {
              ...fieldDecoratorOptions,
              rules: [{ type: 'string', required: field.required, message: 'Invalid' }],
            })(
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {_.map(options, (label, value) =>(
                  <Option key={value} value={value}>{label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        );

      case 'relationship':
        let componentName;
        switch (field.relationshipType) {
          case 'oneToMany':
            componentName = componentsNameGenerator.SelectManyModel(model, field, key);
            if(field.inlineForm) componentName = componentsNameGenerator.SelectManyModelWithForm({ fieldName: key, model, field });
            break;
          default:
            componentName = componentsNameGenerator.SelectModel(model, field, key);
            if(field.inlineForm) componentName = componentsNameGenerator.SelectModelWithForm({ fieldName: key, model, field });
        }

        const { Component } = amon.getComponent(componentName);
        const fieldName = mutationGenerator.getFieldName(field, key);

        return (
          <FormItem {...wrapperProps} hasFeedback={false}>
            {getFieldDecorator(fieldName, {
              ...fieldDecoratorOptions,
              rules: [{ required: field.required, message: 'Required' }],
            })(
              <Component parentForm={form} />
            )}
          </FormItem>
        );

      default:
        return (
          <FormItem {...wrapperProps}>
            {getFieldDecorator(key, {
              ...fieldDecoratorOptions,
              rules: [{
                type: 'string', message: 'Invalid',
              }, {
                required: field.required, message: 'Required',
              }],
            })(
              <Input />
            )}
          </FormItem>
        );
    }
  }
}

export default helpers;
