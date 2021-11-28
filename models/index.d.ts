import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type BookMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DepoMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Book {
  readonly id: string;
  readonly title: string;
  readonly position?: number;
  readonly depos?: (Depo | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Book, BookMetaData>);
  static copyOf(source: Book, mutator: (draft: MutableModel<Book, BookMetaData>) => MutableModel<Book, BookMetaData> | void): Book;
}

export declare class Depo {
  readonly id: string;
  readonly bookID: string;
  readonly title: string;
  readonly position?: number;
  readonly book?: Book;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Depo, DepoMetaData>);
  static copyOf(source: Depo, mutator: (draft: MutableModel<Depo, DepoMetaData>) => MutableModel<Depo, DepoMetaData> | void): Depo;
}