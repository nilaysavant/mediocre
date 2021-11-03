import {
  AccordionButton,
  AccordionButtonProps,
  AccordionIcon,
  AccordionItem,
  AccordionItemProps,
  AccordionPanel,
  AccordionPanelProps,
  Box,
} from '@chakra-ui/react'

export type SectionAccordionItemProps = {
  sectionTitle: React.ReactNode
  sectionContent: React.ReactNode
  accordionItemProps?: AccordionItemProps
  accordionButtonProps?: AccordionButtonProps
  accordionPanelProps?: AccordionPanelProps
}

/**
 * ### Section `accordion` item component.
 *
 * For sections in settings etc.
 *
 * - `sectionTitle`: Title of the section
 * - `sectionContent`: Content of the section
 */
const SectionAccordionItem = ({
  sectionTitle,
  sectionContent,
  accordionItemProps,
  accordionButtonProps,
  accordionPanelProps,
}: SectionAccordionItemProps) => {
  return (
    <AccordionItem {...accordionItemProps}>
      <AccordionButton
        fontSize="sm"
        bg="bg.dark.350"
        _hover={{
          filter: 'brightness(120%)',
        }}
        _focus={{
          boxShadow: `0px 0px 0px 1px var(--chakra-colors-border-focus-500)`,
        }}
        {...accordionButtonProps}
      >
        <Box flex="1" textAlign="left">
          {sectionTitle}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel
        fontSize="sm"
        bg="bg.dark.400"
        color="whiteAlpha.800"
        pt="3"
        {...accordionPanelProps}
      >
        {sectionContent}
      </AccordionPanel>
    </AccordionItem>
  )
}

export default SectionAccordionItem
