# Planning

## Architecture

### Mediocre Document Entity type

  ```ts
  export type MediocreDocument = {
    id: string
    name: string
    content: string
    dir: string
    path: string
    type: 'markdown'
    modified: string
  }
  ```

