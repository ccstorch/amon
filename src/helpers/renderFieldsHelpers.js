import React from 'react';
import _ from 'lodash';
import moment from 'moment';

const helpers = {
  render(value, record, field, displayType = 'short') {
    if(displayType === 'short' && !!field.getSmallData) return field.getSmallData(value, record);
    if(displayType === 'full' && !!field.getFullData) return field.getFullData(value, record);

    switch (field.type) {
      case 'date':
        if(field.format === 'fromNow') return moment(value).fromNow();
        return moment(value).format(field.format || 'DD/MM/YYYY');

      case 'imageUrl':
        if(displayType === 'short') {
          return <img src={value} style={{ height: 32 }} />;
        }
        return <img src={value} />;

      case 'text':
        if(displayType === 'short') {
          return _.truncate(value);
        }

      default:
        return value;
    }
  }
}

export default helpers;
