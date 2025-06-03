'use client'

import React, { useContext, useState, useRef } from "react"
import { RegisterContext } from "./RegisterContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText } from "lucide-react"
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import SignatureInput from '@/components/ui/signature-input'
import { useTranslation } from 'react-i18next'

interface DocumentFile {
  id: string
  file: File
  name: string
}

const createFormSchema = (t: (key: string) => string) => {
  return z.object({
    signature: z.string().min(1, t('client.pages.public.register.providerDocument.signatureError')),
  });
};

type SignatureFormData = z.infer<ReturnType<typeof createFormSchema>>

export default function Step4PrestataireDocuments() {
  const { nextStep, setPrestataireInfo, setIsFinished } = useContext(RegisterContext)
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [documentName, setDocumentName] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [tempFile, setTempFile] = useState<File | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useTranslation()

  const FormSchema = createFormSchema(t);

  const form = useForm<SignatureFormData>({
    resolver: zodResolver(FormSchema),
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setTempFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setTempFile(file)
    }
  }

  const renameFile = (file: File, newName: string): File => {
    const extension = file.name.split('.').pop() || '';
    return new File([file], `${newName}.${extension}`, { type: file.type })
  }

  const addDocument = () => {
    if (tempFile && documentName) {
      const renamedFile = renameFile(tempFile, documentName)
      const newDoc: DocumentFile = {
        id: Math.random().toString(36).substring(2, 9),
        file: renamedFile,
        name: renamedFile.name,
      }
      setDocuments([...documents, newDoc])
      setDocumentName("")
      setTempFile(null)
    }
  }

  const removeDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
  }

  const handleSubmit = (data: SignatureFormData) => {
    setPrestataireInfo((prev: any) => ({ ...prev, documents, signature: data.signature }))
    setIsFinished(true)
    nextStep()
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-semibold">
                {t('client.pages.public.register.providerDocument.title')}
              </h2>
              <p className="text-sm max-w-2xl mx-auto">
                {t('client.pages.public.register.providerDocument.description')}
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-md p-8 text-center ${
                dragActive ? "border-secondary bg-secondary/10" : "border-secondary/20 bg-secondary/5"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-secondary" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">
                    {t('client.pages.public.register.providerDocument.dragDropText')}
                  </p>
                  <p className="text-xs">
                    {t('client.pages.public.register.providerDocument.acceptedFiles')}
                  </p>
                </div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    {t('client.pages.public.register.providerDocument.browseFiles')}
                  </Button>
                </label>
                {tempFile && (
                  <div className="mt-4 text-sm text-gray-600">
                    Fichier temporaire : {tempFile.name}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-name">
                  {t('client.pages.public.register.providerDocument.documentName')}
                </Label>
                <Input
                  id="document-name"
                  placeholder={t('client.pages.public.register.providerDocument.documentNamePlaceholder')}
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="w-full"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="bg-secondary"
                onClick={addDocument}
                disabled={!tempFile || !documentName}
              >
                {t('client.pages.public.register.providerDocument.addDocument')}
              </Button>
            </div>

            {documents.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">
                  {t('client.pages.public.register.providerDocument.uploadedDocuments')}
                </h3>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border-foreground rounded-md">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5" />
                        <span className="text-sm font-medium">{doc.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="signature"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <div>
                      <FormLabel>
                        {t('client.pages.public.register.providerDocument.signatureLabel')}
                      </FormLabel>
                    </div>
                    <div className="mx-auto">
                      <SignatureInput
                        canvasRef={canvasRef}
                        onSignatureChange={field.onChange}
                      />
                    </div>

                    <FormDescription>
                      {t('client.pages.public.register.providerDocument.signatureDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                {t('client.pages.public.register.providerDocument.nextButton')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
