import React from 'react';
import _ from 'lodash';

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
    delete: 'deleteAuthor',
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

    posts: {
      label: 'Posts',
      type: 'relationship',
      relationshipType: 'oneToMany',
      model: 'Post',
      getSelectData: (post) => post && (post.description),
      getSmallData: (posts) => posts && _.map(posts, (post) => post.description).join(', '),
      getFullData: (posts) => posts && (
        <ul>
          {posts.map((post) =>
            <li key={post.id}>{post.description}</li>)
          }
        </ul>
      ),
      requestedFields: {
        description: {},
      }
    }

    // gender: {
    //   label: 'Gender',
    //   type: 'enum',
    //   enum: 'GENDER',
    // },
  },
}
