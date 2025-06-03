import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import {
  File,
  FileCheck,
  FileType,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";
import React from "react";
import { FileUpload } from "@/components/file-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserApi } from "@/api/user.api";
import { useTranslation } from 'react-i18next';

interface Document {
  id: string;
  name: string;
  extension: string;
  uploadDate: string;
  url: string;
}

const getIconByExtension = (extension: string) => {
  switch (extension.toLowerCase()) {
    case "pdf":
      return FileCheck;
    case "doc":
    case "docx":
      return FileType;
    case "xls":
    case "xlsx":
      return FileSpreadsheet;
    case "jpg":
    case "jpeg":
    case "png":
      return FileImage;
    default:
      return File;
  }
};

export default function ProofsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [documents, setDocuments] = useState<Document[]>([]);
  const navigate = useNavigate();

  const [documentName, setDocumentName] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.proofs.breadcrumbHome"), t("client.pages.office.proofs.breadcrumbDocuments")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  const fetchDocuments = async () => {
    try {
      const data = await UserApi.getProviderDocuments();

      const mappedDocs: Document[] = data.map((doc: any) => ({
        id: doc.provider_documents_id,
        name: doc.name,
        extension: doc.name.split('.').pop() || '',
        uploadDate: doc.submission_date,
        url: doc.download_url,
      }));

      setDocuments(mappedDocs);
    } catch (error) {
      console.error(t("client.pages.office.proofs.errorFetchingDocuments"), error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [t]);

  const handleSubmit = async () => {
    if (!selectedFile || !documentName) {
      alert(t("client.pages.office.proofs.alertSelectFile"));
      return;
    }

    try {
      await UserApi.uploadProviderDocument(selectedFile, documentName, documentDescription);
      setDocumentName("");
      setDocumentDescription("");
      setSelectedFile(null);
      await fetchDocuments();
    } catch (error) {
      console.error(t("client.pages.office.proofs.errorUploadingDocument"), error);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">{t("client.pages.office.proofs.title")}</h1>
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
        <Dialog>
          <DialogTrigger>
            <Button className="w-full md:w-auto">{t("client.pages.office.proofs.addProof")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("client.pages.office.proofs.addProofDialogTitle")}</DialogTitle>
              <DialogDescription>
                {t("client.pages.office.proofs.addProofDialogDescription")}
              </DialogDescription>
            </DialogHeader>
            <FileUpload onChange={(files) => setSelectedFile(files[0] || null)} />
            <Label htmlFor="document-name">{t("client.pages.office.proofs.documentName")}</Label>
            <Input
              id="document-name"
              placeholder={t("client.pages.office.proofs.documentNamePlaceholder")}
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
            <Label htmlFor="document-description" className="mt-2">{t("client.pages.office.proofs.documentDescription")}</Label>
            <Textarea
              id="document-description"
              placeholder={t("client.pages.office.proofs.documentDescriptionPlaceholder")}
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
            />
            <Button onClick={handleSubmit} className="mt-4">
              {t("client.pages.office.proofs.submit")}
            </Button>
          </DialogContent>
        </Dialog>
        <Button
          onClick={() => navigate("/office/documents")}
          className="w-full md:w-auto md:ml-auto"
        >
          {t("client.pages.office.proofs.accessAllDocuments")}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-background rounded-lg shadow-lg p-6 flex flex-col items-center text-center border hover:shadow-xl transition"
          >
            {React.createElement(getIconByExtension(doc.extension), {
              className: "w-16 h-16 text-foreground",
            })}
            <h2 className="mt-4 text-lg font-semibold">{doc.name}</h2>
            <p className="text-foreground uppercase">{doc.extension}</p>
            <p className="text-foreground text-sm mt-1">
              {t("client.pages.office.proofs.uploadedOn")} {new Date(doc.uploadDate).toLocaleDateString()}
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                const link = document.createElement("a");
                link.href = doc.url;
                link.download = doc.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              {t("client.pages.office.proofs.downloadDocument")}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
