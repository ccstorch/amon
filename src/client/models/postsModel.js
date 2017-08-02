import React from 'react';

export default {
  name: 'Post',
  labels: {
    list: 'Posts',
    single: 'Post',
  },
  descriptions: false,
  api: {
    list: 'allPosts',
    single: 'Post',
    create: 'createPost',
    update: 'updatePost',
    delete: 'deletePost',
  },

  fields: {
    description: {
      label: 'Descrição',
      type: 'text',
      required: true,
    },
    imageUrl: {
      label: 'Imagem',
      // type: 'imageUrl',
      // required: true,
      // getSmallData: (url, record) => url
    },
    situation: {
      label: 'Situação',
      type: 'enum',
      enum: 'POST_SITUATION',
      // required: true,
      // getSmallData: (url, record) => url
    },

    author: {
      label: 'Author',
      type: 'relationship',
      relationshipType: 'manyToOne',
      model: 'Author',
      getSelectData: (author) => author && (author.name + ', ' + author.age),
      getSmallData: (author, post) => author && author.name,
      getFullData: (author, post) => author && (author.name + ', ' + author.age),
      // required: true,
      requestedFields: {
        name: {},
        age: {},
      }
    },

    createdAt: {
      label: 'Criado em',
      type: 'date',
      format: 'DD/MM/YYYY',
      hideOn: ['form'],
    },

    tags: {
      label: 'Tags',
      type: 'string',
      isArray: true,
    },
  },

  // callbacks: {
  //   beforeFetch(record, isList, amon) {},
  //   beforeSave(newRecord, oldRecord, isEditing, amon) {},
  //   beforeDelete(record, amon) {},
  // },

}
