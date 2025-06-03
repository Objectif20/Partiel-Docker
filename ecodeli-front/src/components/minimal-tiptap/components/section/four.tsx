import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { FormatAction } from '../../types'
import type { toggleVariants } from '@/components/ui/toggle'
import type { VariantProps } from 'class-variance-authority'
import { CaretDownIcon, ListBulletIcon } from '@radix-ui/react-icons'
import { ToolbarSection } from '../toolbar-section'
import { useTranslation } from 'react-i18next'

type ListItemAction = 'orderedList' | 'bulletList'

interface ListItem extends FormatAction {
  value: ListItemAction
}

const formatActions: ListItem[] = [
  {
    value: 'orderedList',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
        <path d="M144-144v-48h96v-24h-48v-48h48v-24h-96v-48h120q10.2 0 17.1 6.9 6.9 6.9 6.9 17.1v48q0 10.2-6.9 17.1-6.9 6.9-17.1 6.9 10.2 0 17.1 6.9 6.9 6.9 6.9 17.1v48q0 10.2-6.9 17.1-6.9 6.9-17.1 6.9H144Zm0-240v-96q0-10.2 6.9-17.1 6.9-6.9 17.1-6.9h72v-24h-96v-48h120q10.2 0 17.1 6.9 6.9 6.9 6.9 17.1v72q0 10.2-6.9 17.1-6.9 6.9-17.1 6.9h-72v24h96v48H144Zm48-240v-144h-48v-48h96v192h-48Zm168 384v-72h456v72H360Zm0-204v-72h456v72H360Zm0-204v-72h456v72H360Z" />
      </svg>
    ),
    isActive: editor => editor.isActive('orderedList'),
    action: editor => editor.chain().focus().toggleOrderedList().run(),
    canExecute: editor => editor.can().chain().focus().toggleOrderedList().run(),
    shortcuts: ['mod', 'shift', '7'],
    label: '' // Cette ligne sera remplie après la traduction
  },
  {
    value: 'bulletList',
    icon: <ListBulletIcon className="size-5" />,
    isActive: editor => editor.isActive('bulletList'),
    action: editor => editor.chain().focus().toggleBulletList().run(),
    canExecute: editor => editor.can().chain().focus().toggleBulletList().run(),
    shortcuts: ['mod', 'shift', '8'],
    label: '' // Cette ligne sera remplie après la traduction
  }
]

interface SectionFourProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  activeActions?: ListItemAction[]
  mainActionCount?: number
}

export const SectionFour: React.FC<SectionFourProps> = ({
  editor,
  activeActions = formatActions.map(action => action.value),
  mainActionCount = 0,
  size,
  variant
}) => {
  const { t } = useTranslation()

  // Mise à jour des labels avec la traduction
  const translatedActions = React.useMemo(() => {
    return formatActions.map(action => ({
      ...action,
      label: t(`wysiwyg.format.${action.value === 'orderedList' ? 'listeOrdonnee' : 'listeAPuces'}`)
    }))
  }, [t])

  return (
    <ToolbarSection
      editor={editor}
      actions={translatedActions}
      activeActions={activeActions}
      mainActionCount={mainActionCount}
      dropdownIcon={
        <>
          <ListBulletIcon className="size-5" />
          <CaretDownIcon className="size-5" />
        </>
      }
      dropdownTooltip={t("wysiwyg.lists")}
      size={size}
      variant={variant}
    />
  )
}

SectionFour.displayName = 'SectionFour'

export default SectionFour
