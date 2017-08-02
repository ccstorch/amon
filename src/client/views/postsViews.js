import React from 'react';

const options = {
  name: 'Posts',
  descriptions: false,
  modelName: 'Post',
  url: 'posts',

  fields: {
    description: {
      // filter: true,
      // hideOn: ['show'],
    },
    imageUrl: {
      filter: true,
    },
    situation: {
      hideOn: ['table'],
    },
    tags: {
      hideOn: ['table'],
    },
    author: {
      inlineForm: true
    },
    createdAt: {
      filter: false,
      // showOn: ['show'],
      hideOn: ['form'],
    },
  },

  customComponents: {
    // ListView: (viewSituation) => () => <div>{ viewSituation.viewName }</div>,
    // ListTable: () => ({ data }) => <div>{console.log(data)}</div>,
    // ListHeader: () => () => <div>Teste</div>,
    // ShowView: () => () => <div>Teste</div>,
    // ShowDetails: () => () => <div>Teste</div>,
    // ShowHeader: () => () => <div>Teste</div>,
    // NewView: () => () => <div>Teste</div>,
    // NewHeader: () => () => <div>Teste</div>,
    // NewForm: () => () => <div>Teste</div>,
    // EditView: () => () => <div>Teste</div>,
    // EditHeader: () => () => <div>Teste</div>,
    // EditForm: () => () => <div>Teste</div>,
  },
}

export default options;
