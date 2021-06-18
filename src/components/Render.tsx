import React, { useContext, useEffect } from 'react'
import 'github-markdown-css/github-markdown.css'
import { useColorMode } from '@chakra-ui/color-mode'
import { Box } from '@chakra-ui/layout'
import clsx from 'clsx'
import { MdThemeContext } from '../styles/markdown'
import { useReduxDispatch, useReduxSelector } from '../redux/hooks'
import { tauri } from '@tauri-apps/api'
import { updateMdText } from '../utils/markdownParser/markdownParserSlice'
import isTauri from '../utils/isTauri'

export interface Props {
  renderBoxRef?: React.RefObject<HTMLDivElement>
  onScroll?: React.UIEventHandler<HTMLDivElement>
}

function Render({ renderBoxRef, onScroll }: Props) {
  const { colorMode } = useColorMode()
  const { theme: mdTheme } = useContext(MdThemeContext)

  const mdText = useReduxSelector((state) => state.markdownParser.mdText)
  const rawText = useReduxSelector((state) => state.markdownParser.rawText)
  const dispatch = useReduxDispatch()

  useEffect(() => {
    /**
     * This is to trigger codeblock highlight function
     * every time the markup is updated, this is what makes
     * PrismJs do its magic after each md render
     */
    // @ts-expect-error PrismJS
    window.Prism.highlightAll()
  }, [mdText])

  useEffect(() => {
    const handleTextChange = async () => {
      if (isTauri()) {
        const res: { markup: string } = await tauri.invoke('parse_md_to_mu', {
          mdString: rawText,
        })
        dispatch(updateMdText(res.markup))
      }
    }
    handleTextChange()
  }, [dispatch, rawText])

  return (
    <Box
      className={clsx(
        mdTheme === 'github2' ? 'markdown-body' : `markdown ${mdTheme}`
      )}
      ref={renderBoxRef}
      marginLeft={0}
      flex={1}
      padding={4}
      textAlign="left"
      height="full"
      overflowY="auto"
      fontSize="md"
      style={{
        background: colorMode === 'dark' ? '#1f1f1f' : 'white',
        borderLeft: `4px solid ${colorMode === 'dark' ? '#303030' : '#d6d6d6'}`,
        color: colorMode === 'dark' ? '#ededed' : '#1f1f1f',
      }}
      onScroll={onScroll}
      dangerouslySetInnerHTML={{
        __html: mdText || '<i>Type something...</i>',
      }}
    ></Box>
  )
}

export default React.memo(Render)
