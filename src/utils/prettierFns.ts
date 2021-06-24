import prettier from 'prettier'
import parserMarkdown from 'prettier/parser-markdown'

export const prettifyText = (rawText: string) =>
  prettier.format(rawText, {
    parser: 'markdown',
    plugins: [parserMarkdown],
  })
