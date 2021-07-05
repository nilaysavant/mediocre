# Planning

## Product Goal

- We need to achieve document editing, updating and saving in a high performance yet efficient manner.

## Entities

### Mediocre Document

```ts
export type MediocreDocument = {
  id: string // doc Id, usually same as path
  name: string // doc file name
  content: string // md content
  dir: string // dir name
  path: string // full path relative to app data dir
  type: 'markdown' // currently only md supported
  modified: string, // modified time and oth meta
  synced: boolean // if content is same as on fs
}
```

## Architecture

- The architecture consists of 3 things:

  - File System
  - Tauri (backend)
  - React (frontend)

### Fetch existing documents to frontend

Pseudo code

```ts
// FRONTEND
fetchExistingDocs(){
  tauriInvoke -> fetchFileSystemDocs()
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
      content: '', // Synced later on Demand
      dir: getDirNameFromPath(pathWithMeta.path),
      path: pathWithMeta.path,
      type: 'markdown',
      modified: pathWithMeta.modified,
      synced: false
    })
    reduxDispatch -> documentsInitialized(mappedDocs)
  }
}
```

### Open Existing document on frontend

Pseudo code

```ts
// FRONTEND
openDocument(documentId) {
  isDocumentSynced(documentId){
    case YES: {
      loadContentToView(documentId)
    }
    case NO: {
      reduxSelect -> getDocumentPath(id)
      tauriInvoke -> requestDocumentContent(documentPath)
      // BACKEND
      onDocumentContentRequest(documentPath) {
        fileContent = readFileFromPath(documentPath)
        return fileContent
      }
      // FRONTEND
      onReceiveDocumentContent(fileContent) {
        reduxDispatch -> documentUpdated(documentID, {
          content: fileContent,
          synced: true
        })
      }
    }
  }
}
```

### Create New Document

Pseudo code

```ts
// FRONTEND
createDocument(){
  reduxDispatch -> documentAdded({
    id: generatePath(project, name),
    name: name,
    content: '',
    dir: getDirNameFromPath(generatePath(project, name)),
    path: generatePath(project, name),
    type: 'markdown',
    modified: '',
  })
}
// FRONTEND
onSaveDocument(documentId) {
  // FRONTEND
  reduxSelect -> getDocumentPathAndContent(documentId)
  tauriInvoke -> saveFileToFs({
    path: path,
    content: content,
  })
  // BACKEND
  onSaveFileToFs() {
    writeFileToFs(path, content)
    return
  }
  // FRONTEND
  reduxDispatch -> documentUpdated(documentId, {
    synced: true,
  })
}
```
