import { Accordion, Box } from '@chakra-ui/react'
import { getUniqueIdV4 } from 'src/utils/idGenerator'
import SectionAccordionItem from './SectionAccordionItem'

const generalSettingsSections: {
  id: string
  title: React.ReactNode
  content: React.ReactNode
}[] = [
  {
    id: getUniqueIdV4(),
    title: 'Cloud Sync',
    content: <Box>Cloud Sync Content</Box>,
  },
  {
    id: getUniqueIdV4(),
    title: 'Privacy',
    content: <Box>Privacy Content</Box>,
  },
]

/**
 * General Settings
 * @returns
 */
const General = () => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple>
      {generalSettingsSections.map((item, idx) => (
        <SectionAccordionItem
          key={item.id}
          sectionTitle={item.title}
          sectionContent={item.content}
          accordionItemProps={{
            borderTop: idx === 0 ? 'none' : undefined,
          }}
        />
      ))}
    </Accordion>
  )
}

export default General
