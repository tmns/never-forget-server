import { buildSchema } from 'graphql';
import { schemaToTemplateContext } from 'graphql-codegen-core';
import { loadTypeSchema } from '../../../utils/schema';
import { mockServer } from 'graphql-tools';

describe('User schema', () => {
  let schema, typeDefs
  beforeAll(async () => {
    const root = `
      schema {
        query: Query
        mutation: Mutation
      }
    `

    const typeSchemas = await Promise.all(
      ['user'].map(loadTypeSchema)
    )
    typeDefs = root + typeSchemas.join(' ');
    schema = schemaToTemplateContext(buildSchema(typeDefs));
  })
  test('User has base fields', () => {
    let type = schema.types.find(t => {
      return t.name == 'User';
    })

    expect(type).toBeTruthy();

    let baseFields = {
      username: 'String!',
      password: 'String!'
    }

    type.fields.forEach(field => {
      let type = baseFields[field.name]
      expect(field.raw).toBe(type);
    })
  })
  
})