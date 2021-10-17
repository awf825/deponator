import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type BookMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Book {
  readonly id: string;
  readonly title: string;
  readonly position?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Book, BookMetaData>);
  static copyOf(source: Book, mutator: (draft: MutableModel<Book, BookMetaData>) => MutableModel<Book, BookMetaData> | void): Book;
}