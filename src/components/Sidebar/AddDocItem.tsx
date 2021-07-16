import React, { useRef, useState } from 'react'
import { AiOutlineFileMarkdown } from 'react-icons/ai'
import {
  Input,
  ListIcon,
  ListItem,
  ListItemProps,
  Text,
} from '@chakra-ui/react'

export type AddDocItemProps = {
  onAdd: (fileName: string) => void
  onCancel: () => void
} & ListItemProps

const AddDocItem = ({ onAdd, onCancel, ...rest }: AddDocItemProps) => {
  const addInputRef = useRef<HTMLInputElement>(null)
  const [addItem, setAddItem] = useState({
    value: 'Untitled.md',
  })

  return (
    <ListItem
      width="full"
      display="flex"
      alignItems="center"
      paddingX="0.5"
      userSelect="none"
      cursor="pointer"
      // bg={doc.id === selectedDocument ? '#adadad21' : undefined}
      onClick={() => {
        setTimeout(() => {
          if (addInputRef.current) {
            addInputRef.current.focus()
            addInputRef.current.setSelectionRange(
              0,
              addInputRef.current.value.length - 3,
              'forward'
            )
          }
        }, 0)
      }}
      {...rest}
    >
      <ListIcon
        as={AiOutlineFileMarkdown}
        color="#0099e0"
        fontSize="lg"
        marginRight="0"
      />
      <Input
        size="xxs"
        _focus={{
          boxShadow: '0px 0px 0px 1px #51a3f0c9',
        }}
        placeholder="Rename Document"
        ref={addInputRef}
        value={addItem.value}
        onChange={(e) =>
          setAddItem((old) => ({ ...old, value: e.target.value }))
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            /** Press Enter to add new document */
            onAdd(addItem.value)
            setAddItem({ value: '' })
          } else if (e.key === 'Escape') {
            /** Press Esc to cancel */
            onCancel()
            setAddItem({ value: '' })
          }
        }}
      />
    </ListItem>
  )
}

export default React.memo(AddDocItem)
