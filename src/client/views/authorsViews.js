const options = {
  name: 'Authors',
  descriptions: false,
  modelName: 'Author',
  url: 'authors',

  // TODO: Make it able to use custom api
  // api: {
  //   list: 'allAuthors',
  //   single: 'Author',
  //   create: 'createAuthor',
  //   update: 'updateAuthor',
  // },

  fields: {
    name: {},
    age: {},
    // gender: {},
  },
}

export default options;
