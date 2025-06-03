import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { Level } from '@tiptap/extension-heading'
import type { FormatAction } from '../../types'
import type { VariantProps } from 'class-variance-authority'
import type { toggleVariants } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { CaretDownIcon, LetterCaseCapitalizeIcon } from '@radix-ui/react-icons'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ToolbarButton } from '../toolbar-button'
import { ShortcutKey } from '../shortcut-key'
import { useTranslation } from 'react-i18next'

interface TextStyle extends Omit<FormatAction, 'value' | 'icon' | 'action' | 'isActive' | 'canExecute'> {
  element: keyof React.JSX.IntrinsicElements
  level?: Level
  className: string
}

const formatActions: TextStyle[] = [
  {
    label: 'Normal',
    element: 'span',
    className: 'grow',
    shortcuts: ['mod', 'alt', '0']
  },
  {
    label: 'Heading1',
    element: 'h1',
    level: 1,
    className: 'm-0 grow text-3xl font-extrabold',
    shortcuts: ['mod', 'alt', '1']
  },
  {
    label: 'Heading2',
    element: 'h2',
    level: 2,
    className: 'm-0 grow text-xl font-bold',
    shortcuts: ['mod', 'alt', '2']
  },
  {
    label: 'Heading3',
    element: 'h3',
    level: 3,
    className: 'm-0 grow text-lg font-semibold',
    shortcuts: ['mod', 'alt', '3']
  },
  {
    label: 'Heading4',
    element: 'h4',
    level: 4,
    className: 'm-0 grow text-base font-semibold',
    shortcuts: ['mod', 'alt', '4']
  },
  {
    label: 'Heading5',
    element: 'h5',
    level: 5,
    className: 'm-0 grow text-sm font-normal',
    shortcuts: ['mod', 'alt', '5']
  },
  {
    label: 'Heading6',
    element: 'h6',
    level: 6,
    className: 'm-0 grow text-sm font-normal',
    shortcuts: ['mod', 'alt', '6']
  }
]

interface SectionOneProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  activeLevels?: Level[]
}

export const SectionOne: React.FC<SectionOneProps> = React.memo(
  ({ editor, activeLevels = [1, 2, 3, 4, 5, 6], size, variant }) => {
    const { t } = useTranslation();

    const filteredActions = React.useMemo(
      () => formatActions.filter(action => !action.level || activeLevels.includes(action.level)),
      [activeLevels]
    )

    const handleStyleChange = React.useCallback(
      (level?: Level) => {
        if (level) {
          editor.chain().focus().toggleHeading({ level }).run()
        } else {
          editor.chain().focus().setParagraph().run()
        }
      },
      [editor]
    )

    const renderMenuItem = React.useCallback(
      ({ label, element: Element, level, className, shortcuts }: TextStyle) => (
        <DropdownMenuItem
          key={label}
          onClick={() => handleStyleChange(level)}
          className={cn('flex flex-row items-center justify-between gap-4', {
            'bg-accent': level ? editor.isActive('titre', { level }) : editor.isActive('paragraph')
          })}
          aria-label={label}
        >
          {React.createElement(Element, { className }, t(`wysiwyg.format.${label.toLowerCase()}`))}
          <ShortcutKey keys={shortcuts} />
        </DropdownMenuItem>
      ),
      [editor, handleStyleChange, t]
    )

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ToolbarButton
            isActive={editor.isActive('heading')}
            tooltip={t("wysiwyg.format.autoFormat")}
            aria-label="Text styles"
            pressed={editor.isActive('heading')}
            className="w-12"
            disabled={editor.isActive('codeBlock')}
            size={size}
            variant={variant}
          >
            <LetterCaseCapitalizeIcon className="size-5" />
            <CaretDownIcon className="size-5" />
          </ToolbarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-full">
          {filteredActions.map(renderMenuItem)}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

SectionOne.displayName = 'SectionOne'

export default SectionOne;
