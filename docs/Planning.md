# Planning

## Product Goal

- We need to achieve document editing, updating and saving in a high performance yet efficient manner.

## Entities

### Mediocre Document

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

## Architecture

- The architecture consists of 3 things:

  - File System
  - Tauri (backend)
  - React (frontend)

### Fetch existing documents to redux frontend

Pseudo code

```ts
// FRONTEND
fetchFileSystemDocs()
// BACKEND
onFetchCommand(){
  fetchFSDocumentPathsWithMetaData()
  return pathWithMeta[] // Sent to FRONTEND
}
// FRONTEND
onReceiveDocument(pathWithMeta[]) {
  mappedDocs = pathWithMeta.map({
    id: pathWithMeta.path,
    name: getFileNameFromPath(pathWithMeta.path),
    content: '', // Synced on Demand
    dir: getDirNameFromPath(pathWithMeta.path),
    path: pathWithMeta.path,
    type: 'markdown',
    modified: pathWithMeta.modified.
  })
  // save as init documents
  setDocumentsInRedux(mappedDocs)
}
```

### Open Existing document on frontend

Pseudo code

```ts
// FRONTEND
openDocument()
isDocumentSynced(){
  case YES: {
    loadContentToView()
  }
  case NO: {
    requestDocumentContent(documentPath)
    // BACKEND
    onDocumentContentRequest(documentPath) {
      fileContent = readFileFromPath(documentPath)
      return fileContent
    }
    // FRONTEND
    onReceiveDocumentContent(fileContent) {
      updateDocumentInRedux(documentID, {
        content: fileContent
      })
    }
  }
}
```
