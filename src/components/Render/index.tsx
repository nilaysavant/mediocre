import React, { useEffect, useRef } from 'react'
import 'github-markdown-css/github-markdown.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.css'
import { useColorMode } from '@chakra-ui/color-mode'
import { Box } from '@chakra-ui/layout'
import clsx from 'clsx'
import { useReduxDispatch, useReduxSelector } from '../../redux/hooks'
import { tauri } from '@tauri-apps/api'
import { updateMdText } from '../../utils/markdownParser/markdownParserSlice'
import isTauri from '../../utils/isTauri'
import { useDebounce } from '../../utils/hooks/useDebounce'

export interface Props {
  renderBoxRef?: React.RefObject<HTMLDivElement>
  onScroll?: React.UIEventHandler<HTMLDivElement>
}

const Render = ({ renderBoxRef, onScroll }: Props) => {
  const renderBoxWrapperRef = useRef<HTMLDivElement>(null)
  const { colorMode } = useColorMode()
  const mdTheme = useReduxSelector((state) => state.markdownTheme.theme)
  const { mdText, rawText } = useReduxSelector((state) => state.markdownParser)
  const dispatch = useReduxDispatch()
  const debouncedRawText = useDebounce(rawText, 1000)

  useEffect(() => {
    /**
     * This is to trigger codeblock highlight function
     * every time the markup is updated, this is what makes
     * HighlightJs do its magic after each md render. It is supposed
     * to only apply highlighting to the children of the cssSelected classes configured`
     */
    hljs.configure({
      cssSelector:
        mdTheme === 'github2'
          ? '.markdown-body pre code'
          : `.markdown pre code`,
    })
    hljs.highlightAll()
  }, [mdText, mdTheme])

  useEffect(() => {
    const handleTextChange = async () => {
      if (isTauri()) {
        const res: { markup: string } = await tauri.invoke('parse_md_to_mu', {
          mdString: debouncedRawText,
        })
        dispatch(updateMdText(res.markup))
      }
    }
    handleTextChange()
  }, [debouncedRawText, dispatch])

  return (
    <Box ref={renderBoxWrapperRef} flex={1} minWidth="0">
      <Box
        className={clsx(
          mdTheme === 'github2' ? 'markdown-body' : `markdown ${mdTheme}`
        )}
        ref={renderBoxRef}
        // flex={1}
        fontFamily={`"Droid Sans Mono", monospace, monospace, "Droid Sans Fallback"`}
        fontWeight="normal"
        marginLeft={0}
        padding="10px"
        textAlign="left"
        height="full"
        overflowY="auto"
        fontSize="13px"
        lineHeight="20px"
        background={colorMode === 'dark' ? 'bg.editor.dark' : 'white'}
        color={colorMode === 'dark' ? '#d4d4d4' : '#1f1f1f'}
        outline="none"
        css={{
          '*::selection': {
            background: 'rgba(87, 169, 255, 0.4)',
          },
        }}
        onScroll={onScroll}
        dangerouslySetInnerHTML={{
          __html:
            (mdText || '<i>Type something...</i>') +
            `<div style="height: 100%"></div>`, // adds the extra height `monaco` editor has to match it
        }}
      ></Box>
    </Box>
  )
}

export default React.memo(Render)
