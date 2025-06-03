import * as React from 'react'
import type { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'

interface ImageEditBlockProps {
  editor: Editor
  close: () => void
}

export const ImageEditBlock: React.FC<ImageEditBlockProps> = ({ editor, close }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [link, setLink] = React.useState('')
  const {t} = useTranslation();

  const handleClick = React.useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFile = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files?.length) return
  
      const insertImages = async () => {
        const contentBucket = []
        const filesArray = Array.from(files)
  
        for (const file of filesArray) {
          const src = URL.createObjectURL(file)
  
          // Charger l'image pour obtenir ses dimensions
          const img = new Image()
          img.src = src
  
          await new Promise((resolve) => {
            img.onload = resolve
          })
  
          // Vérification des dimensions
          const width =  img.width > 0 ? img.width : 100
          const height = img.height > 0 ? img.height : 100
  
          contentBucket.push({ src, width, height })
        }
  
        editor.commands.setImages(contentBucket)
      }
  
      await insertImages()
      close()
    },
    [editor, close]
  )

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (link) {
        editor.commands.setImages([{ src: link }])
        close()
      }
    },
    [editor, link, close]
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="image-link">{t("wysiwyg.image.titreLienImage")}</Label>
        <div className="flex">
          <Input
            id="image-link"
            type="url"
            required
            placeholder="https://example.com"
            value={link}
            className="grow"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
          />
          <Button type="submit" className="ml-2">
            {t("wysiwyg.image.ajouter")}
          </Button>
        </div>
      </div>
      <Button type="button" className="w-full" onClick={handleClick}>
        {t("wysiwyg.image.uploadFromComputer")}
      </Button>
      <input type="file" accept="image/*" ref={fileInputRef} multiple className="hidden" onChange={handleFile} />
    </form>
  )
}

export default ImageEditBlock
