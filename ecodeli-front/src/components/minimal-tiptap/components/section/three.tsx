import * as React from 'react'
import { useTranslation } from 'react-i18next'
import type { Editor } from '@tiptap/react'
import type { toggleVariants } from '@/components/ui/toggle'
import type { VariantProps } from 'class-variance-authority'
import { CaretDownIcon, CheckIcon } from '@radix-ui/react-icons'
import { ToolbarButton } from '../toolbar-button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTheme } from '../../hooks/use-theme'

interface ColorItem {
  cssVar: string
  label: string
  darkLabel?: string
}

interface ColorPalette {
  label: string
  colors: ColorItem[]
  inverse: string
}

const MemoizedColorButton = React.memo<{
  color: ColorItem
  isSelected: boolean
  inverse: string
  onClick: (value: string) => void
}>(({ color, isSelected, inverse, onClick }) => {
  const isDarkMode = useTheme()
  const label = isDarkMode && color.darkLabel ? color.darkLabel : color.label

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ToggleGroupItem
          tabIndex={0}
          className="relative size-7 rounded-md p-0"
          value={color.cssVar}
          aria-label={label}
          style={{ backgroundColor: color.cssVar }}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            onClick(color.cssVar)
          }}
        >
          {isSelected && <CheckIcon className="absolute inset-0 m-auto size-6" style={{ color: inverse }} />}
        </ToggleGroupItem>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
})

MemoizedColorButton.displayName = 'MemoizedColorButton'

const MemoizedColorPicker = React.memo<{
  palette: ColorPalette
  selectedColor: string
  inverse: string
  onColorChange: (value: string) => void
}>(({ palette, selectedColor, inverse, onColorChange }) => (
  <ToggleGroup
    type="single"
    value={selectedColor}
    onValueChange={(value: string) => {
      if (value) onColorChange(value)
    }}
    className="gap-1.5"
  >
    {palette.colors.map((color, index) => (
      <MemoizedColorButton
        key={index}
        inverse={inverse}
        color={color}
        isSelected={selectedColor === color.cssVar}
        onClick={onColorChange}
      />
    ))}
  </ToggleGroup>
))

MemoizedColorPicker.displayName = 'MemoizedColorPicker'

interface SectionThreeProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
}

export const SectionThree: React.FC<SectionThreeProps> = ({ editor, size, variant }) => {
  const { t } = useTranslation()
  const color = editor.getAttributes('textStyle')?.color || 'hsl(var(--foreground))'
  const [selectedColor, setSelectedColor] = React.useState(color)

  const handleColorChange = React.useCallback(
    (value: string) => {
      setSelectedColor(value)
      editor.chain().setColor(value).run()
    },
    [editor]
  )

  React.useEffect(() => {
    setSelectedColor(color)
  }, [color])

  // Les palettes de couleurs avec les traductions appliquées
  const COLORS: ColorPalette[] = [
    {
      label: t("wysiwyg.color.palette1.title"),
      inverse: 'hsl(var(--background))',
      colors: [
        { cssVar: 'hsl(var(--foreground))', label: t("wysiwyg.color.palette1.default") },
        { cssVar: 'var(--mt-accent-bold-blue)', label: t("wysiwyg.color.palette1.boldBlue") },
        { cssVar: 'var(--mt-accent-bold-teal)', label: t("wysiwyg.color.palette1.boldTeal") },
        { cssVar: 'var(--mt-accent-bold-green)', label: t("wysiwyg.color.palette1.boldGreen") },
        { cssVar: 'var(--mt-accent-bold-orange)', label: t("wysiwyg.color.palette1.boldOrange") },
        { cssVar: 'var(--mt-accent-bold-red)', label: t("wysiwyg.color.palette1.boldRed") },
        { cssVar: 'var(--mt-accent-bold-purple)', label: t("wysiwyg.color.palette1.boldPurple") }
      ]
    },
    {
      label: t("wysiwyg.color.palette2.title"),
      inverse: 'hsl(var(--background))',
      colors: [
        { cssVar: 'var(--mt-accent-gray)', label: t("wysiwyg.color.palette2.gray") },
        { cssVar: 'var(--mt-accent-blue)', label: t("wysiwyg.color.palette2.blue") },
        { cssVar: 'var(--mt-accent-teal)', label: t("wysiwyg.color.palette2.teal") },
        { cssVar: 'var(--mt-accent-green)', label: t("wysiwyg.color.palette2.green") },
        { cssVar: 'var(--mt-accent-orange)', label: t("wysiwyg.color.palette2.orange") },
        { cssVar: 'var(--mt-accent-red)', label: t("wysiwyg.color.palette2.red") },
        { cssVar: 'var(--mt-accent-purple)', label: t("wysiwyg.color.palette2.purple") }
      ]
    },
    {
      label: t("wysiwyg.color.palette3.title"),
      inverse: 'hsl(var(--foreground))',
      colors: [
        { cssVar: 'hsl(var(--background))', label: t("wysiwyg.color.palette3.white"), darkLabel: t("wysiwyg.color.palette3.black") },
        { cssVar: 'var(--mt-accent-blue-subtler)', label: t("wysiwyg.color.palette3.blueSubtle") },
        { cssVar: 'var(--mt-accent-teal-subtler)', label: t("wysiwyg.color.palette3.tealSubtle") },
        { cssVar: 'var(--mt-accent-green-subtler)', label: t("wysiwyg.color.palette3.greenSubtle") },
        { cssVar: 'var(--mt-accent-yellow-subtler)', label: t("wysiwyg.color.palette3.yellowSubtle") },
        { cssVar: 'var(--mt-accent-red-subtler)', label: t("wysiwyg.color.palette3.redSubtle") },
        { cssVar: 'var(--mt-accent-purple-subtler)', label: t("wysiwyg.color.palette3.purpleSubtle") }
      ]
    }
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <ToolbarButton tooltip={t("wysiwyg.color.titre")} aria-label={t("wysiwyg.color.titre")} className="w-12" size={size} variant={variant}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
            style={{ color: selectedColor }}
          >
            <path d="M4 20h16" />
            <path d="m6 16 6-12 6 12" />
            <path d="M8 12h8" />
          </svg>
          <CaretDownIcon className="size-5" />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full">
        <div className="space-y-1.5">
          {COLORS.map((palette, index) => (
            <MemoizedColorPicker
              key={index}
              palette={palette}
              inverse={palette.inverse}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

SectionThree.displayName = 'SectionThree'

export default SectionThree
