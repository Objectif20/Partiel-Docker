import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImageUp, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const ImageUpload = ({ index, maxFiles = 5, onImagesChange }: { index: number; maxFiles?: number; onImagesChange?: (images: File[]) => void }) => {
  const [images, setImages] = useState<File[]>([]);
  const [base64Images, setBase64Images] = useState<string[]>([]);

  const onDrop = async (acceptedFiles: File[]) => {
    const newImages = [...images, ...acceptedFiles].slice(0, maxFiles);
    setImages(newImages);
    const newBase64Images = await Promise.all(newImages.map(file => fileToBase64(file)));
    setBase64Images(newBase64Images);
    onImagesChange?.(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    const newBase64Images = base64Images.filter((_, i) => i !== index);
    setBase64Images(newBase64Images);
    onImagesChange?.(newImages);
    localStorage.setItem(`package-image-${index}`, JSON.stringify(newBase64Images));
  };

  useEffect(() => {
    const storedImages = localStorage.getItem(`package-image-${index}`);
    if (storedImages) {
      setBase64Images(JSON.parse(storedImages));
    }
  }, [index]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles,
    onDrop,
  });

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        className={cn(
          'relative h-auto w-full flex flex-row overflow-auto p-8 border border-dashed',
          isDragActive && 'ring-1 ring-ring'
        )}
      >
        {base64Images.map((base64, i) => (
          <div key={i} className="relative w-32 h-32 mr-2">
            <img
              src={base64} 
              alt={`preview-${i}`}
              className="w-full h-full object-cover rounded-md border"
            />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              onClick={() => removeImage(i)}
            >
              <XIcon size={12} />
            </button>
          </div>
        ))}
        <div className="h-32 w-32 flex items-center justify-center" {...getRootProps()}>
          <input {...getInputProps()} />
          <Button
            type="button"
            variant="outline"
            className="h-full w-full flex items-center justify-center"
          >
            <ImageUp size={32} />
          </Button>
        </div>
      </div>
    </div>
  );
};
