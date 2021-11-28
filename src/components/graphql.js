export const AddBook = `    
mutation ($title: String! $author: String) {
  createBook(input: {
    title: $title
  }) {
    id title position
  }
}
`;

export const ListBooks = `
query {
  listBooks {
    items {
      id 
      title 
      position 
      depos {
        items {
          id 
          title
          position
        }
      }
    }
  }
}
`;