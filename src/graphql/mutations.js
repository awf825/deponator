/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBook = /* GraphQL */ `
  mutation CreateBook(
    $input: CreateBookInput!
    $condition: ModelBookConditionInput
  ) {
    createBook(input: $input, condition: $condition) {
      id
      title
      position
      depos {
        items {
          id
          bookID
          title
          position
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateBook = /* GraphQL */ `
  mutation UpdateBook(
    $input: UpdateBookInput!
    $condition: ModelBookConditionInput
  ) {
    updateBook(input: $input, condition: $condition) {
      id
      title
      position
      depos {
        items {
          id
          bookID
          title
          position
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteBook = /* GraphQL */ `
  mutation DeleteBook(
    $input: DeleteBookInput!
    $condition: ModelBookConditionInput
  ) {
    deleteBook(input: $input, condition: $condition) {
      id
      title
      position
      depos {
        items {
          id
          bookID
          title
          position
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createDepo = /* GraphQL */ `
  mutation CreateDepo(
    $input: CreateDepoInput!
    $condition: ModelDepoConditionInput
  ) {
    createDepo(input: $input, condition: $condition) {
      id
      bookID
      title
      position
      book {
        id
        title
        position
        depos {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateDepo = /* GraphQL */ `
  mutation UpdateDepo(
    $input: UpdateDepoInput!
    $condition: ModelDepoConditionInput
  ) {
    updateDepo(input: $input, condition: $condition) {
      id
      bookID
      title
      position
      book {
        id
        title
        position
        depos {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteDepo = /* GraphQL */ `
  mutation DeleteDepo(
    $input: DeleteDepoInput!
    $condition: ModelDepoConditionInput
  ) {
    deleteDepo(input: $input, condition: $condition) {
      id
      bookID
      title
      position
      book {
        id
        title
        position
        depos {
          nextToken
          startedAt
        }
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
