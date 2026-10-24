# Library Books API

## Endpoints

- **List all books**
  - Method: `GET`
  - Path: `/books`
  - Description: Returns all books.
  - Success status: `200 OK`

- **Get one book**
  - Method: `GET`
  - Path: `/books/42`
  - Description: Returns the book with ID 42.
  - Success status: `200 OK`

- **Create a book**
  - Method: `POST`
  - Path: `/books`
  - Description: Creates a new book.
  - Example request body:
    ```json
    {
      "title": "Things Fall Apart",
      "author": "Chinua Achebe"
    }
    ```
  - Success status: `201 Created`

- **Update a book**
  - Method: `PATCH`
  - Path: `/books/42`
  - Description: Updates selected fields of book 42.
  - Example request body:
    ```json
    {
      "title": "Updated Book Title"
    }
    ```
  - Success status: `200 OK`

- **Delete a book**
  - Method: `DELETE`
  - Path: `/books/42`
  - Description: Deletes book 42.
  - Success status: `204 No Content`

- **List books by author**
  - Method: `GET`
  - Path: `/books?author=Chinua%20Achebe`
  - Description: Returns books written by the specified author.
  - Success status: `200 OK`

## Error Codes

- **400 Bad Request:** The request contains invalid data, such as a missing book title when creating a book.
- **404 Not Found:** The requested book does not exist, such as `GET /books/999`.
