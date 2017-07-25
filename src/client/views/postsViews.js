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
    author: {},
    createdAt: {
      filter: false,
      // showOn: ['show'],
      hideOn: ['form'],
    },
  },

  callbacks: {
  },

  // customViews: {
  //   index: () => <Test />
  //   show: () => <Test />
  //   new: () => <Test />
  //   edit: () => <Test />
  //   form: () => <Test />
  // },
}

export default options;
