import { useState, useEffect, useCallback } from "react";
import { FilesystemItem } from "@/components/ui/filesystem-items";
import axiosInstance from "@/api/axiosInstance";
import { File } from "lucide-react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useTranslation } from "react-i18next";
import MyPDFReader from "@/components/pdf-viewer";
import { ProfileAPI } from "@/api/profile.api";

export default function DocumentsPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [nodes, setNodes] = useState<{ name: string }[]>([]);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.myDocuments.home"), t("client.pages.office.myDocuments.myDocuments")],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() =>{

    const fetchMyDocuments = async () => {
      try {
        const response = await ProfileAPI.getMyProfileDocuments();
        setNodes([response]);
      } catch (error) {
        console.error(t("client.pages.office.myDocuments.error"), error);
      }
    };
    fetchMyDocuments();

  }, [])

  const handleFileClick = useCallback(async (url: string) => {
    try {
      const response = await axiosInstance.get('/client/utils/document', {
        params: { url },
        responseType: 'arraybuffer',
      });
  
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
  
      if (contentType === 'application/pdf') {
        if (isMobile) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "document.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          const objectURL = URL.createObjectURL(blob);
          setPdfUrl(objectURL);
        }
      } else if (contentType.startsWith('image/')) {
        const objectURL = URL.createObjectURL(blob);
        setPdfUrl(objectURL);
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = url.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
  
    } catch (error) {
      console.error(t("client.pages.office.myDocuments.error"), error);
    }
  }, [isMobile, t]);

  return (
    <div className="flex flex-col h-full md:flex-row">
      <div className="w-full md:w-1/4 p-4 md:border-r overflow-y-auto">
        <ul>
          {nodes.map((node) => (
            <FilesystemItem
              node={node}
              key={node.name}
              animated
              onFileClick={handleFileClick}
            />
          ))}
        </ul>
      </div>
      <div className="w-full md:w-3/4 p-4">
        {pdfUrl && !isMobile && (
          <>
            {/*<iframe
            src={pdfUrl}
            className="w-full h-full"
            style={{ border: "none" }}
          />*/}
          <MyPDFReader fileURL={pdfUrl} />
          </>

        )}
        {!pdfUrl && !isMobile && (
          <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
            <File
              size={32}
              className="text-muted-foreground/50 mb-2"
            />
            <h3 className="text-lg font-medium">{t("client.pages.office.myDocuments.noDocumentSelected")}</h3>
            <p className="text-muted-foreground">
              {t("client.pages.office.myDocuments.selectDocument")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
