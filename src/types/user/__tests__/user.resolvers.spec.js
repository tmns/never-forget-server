import { buildSchema } from 'graphql';
import { schemaToTemplateContext } from 'graphql-codegen-core';
import { loadTypeSchema } from '../../../utils/schema';
import { mockServer } from 'graphql-yoga';

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
  })
  
})