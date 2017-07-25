export default {
  name: 'Author',
  labels: {
    list: 'Authors',
    single: 'Author',
  },
  descriptions: false,
  api: {
    list: 'allAuthors',
    single: 'Author',
    create: 'createAuthor',
    update: 'updateAuthor',
  },

  fields: {
    name: {
      label: 'Name',
      type: 'string',
      required: true,
    },

    age: {
      label: 'Age',
      type: 'integer',
      required: true,
    },

    // gender: {
    //   label: 'Gender',
    //   type: 'enum',
    //   enum: 'GENDER',
    // },
  },
}
