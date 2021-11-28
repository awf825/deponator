// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Book, Depo } = initSchema(schema);

export {
  Book,
  Depo
};