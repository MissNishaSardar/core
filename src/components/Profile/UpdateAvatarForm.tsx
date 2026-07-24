"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CloudUploadIcon, Loader2Icon } from "lucide-react";
import { toast } from "react-toastify";
import { CardContent, CardFooter } from "@/components/shadcnui/card";
import { Button } from "@/components/shadcnui/button";
import { updateAvatarAction } from "@/server/updateAvatar";

type UpdateAvatarFormProps = {
  prevImage: string | null | undefined;
  name: string;
};

const UpdateAvatarForm = ({ prevImage, name }: UpdateAvatarFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { push } = useRouter();

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    const { isSuccess, message } = await updateAvatarAction(
      selectedFile,
      prevImage,
    );

    if (isSuccess) {
      toast.success(message);
      push("/dashboard/profile");
    } else {
      toast.error(message);
    }

    setIsLoading(false);
  };

  const hasImage = preview || prevImage;

  return (
    <>
      <CardContent className="grid place-items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button type="button" onClick={() => inputRef.current?.click()} className="relative">
          {hasImage ?
            <Image
              src={preview || prevImage!}
              alt=""
              className="size-64 rounded-full object-cover"
              height={256}
              width={256}
              unoptimized={!!preview}
            />
          : <div className="flex size-64 items-center justify-center rounded-full bg-muted">
              <span className="text-6xl font-bold text-muted-foreground">
                {initials}
              </span>
            </div>
          }
        </button>
      </CardContent>

      <CardFooter className="flex items-center justify-center gap-1">
        <Button type="button" onClick={handleUpdate} disabled={!selectedFile}>
          {isLoading ?
            <>
              <Loader2Icon className="animate-spin" /> Uploading..
            </>
          : <>
              <CloudUploadIcon /> Upload
            </>
          }
        </Button>
      </CardFooter>
    </>
  );
};

export default UpdateAvatarForm;
