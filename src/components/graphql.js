export const AddBook = `    
mutation ($title: String! $author: String) {
  createBook(input: {
    title: $title
    author: $author
  }) {
    id title author
  }
}
`;

export const ListBooks = `
query {
  listBooks {
    items {
      id title author 
    }
  }
}
`;