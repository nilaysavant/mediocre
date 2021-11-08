import { getUniqueIdV4 } from 'src/utils/idGenerator'
import GitSyncForm from './GitSyncForm'

/**
 * ### Stepper Screens Config
 * A array of objects, each object describes the
 * config of respective stepper screen.
 */
export const stepperScreens: {
  id: string
  title: string
  content: React.ReactNode
}[] = [
  {
    id: getUniqueIdV4(),
    title: 'Setup Git Sync',
    content: (
      <GitSyncForm
        formStyle={{
          paddingTop: '0.5rem',
          flex: '1',
          minHeight: 0,
        }}
      />
    ),
  },
  {
    id: getUniqueIdV4(),
    title: 'Setup Git Sync',
    content: (
      <GitSyncForm
        formStyle={{
          paddingTop: '0.5rem',
          flex: '1',
          minHeight: 0,
        }}
      />
    ),
  },
  {
    id: getUniqueIdV4(),
    title: 'Setup Git Sync',
    content: (
      <GitSyncForm
        formStyle={{
          paddingTop: '0.5rem',
          flex: '1',
          minHeight: 0,
        }}
      />
    ),
  },
]

export default null
