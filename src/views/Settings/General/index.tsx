import { Accordion } from '@chakra-ui/react'
import { generalSettingsSections } from './config'
import SectionAccordionItem from './SectionAccordionItem'

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
