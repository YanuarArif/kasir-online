import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ServiceFormValues } from "../types";
import { Paperclip, X, FileText, Image, File } from "lucide-react";

interface AttachmentsSectionProps {
  control: Control<ServiceFormValues>;
  isPending: boolean;
  handleAttachmentUpload: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  isUploading: boolean;
  attachments: string[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  fileInputKey: number;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  control,
  isPending,
  handleAttachmentUpload,
  isUploading,
  attachments,
  fileInputRef,
  fileInputKey,
}) => {
  // Function to get icon based on file extension
  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (["pdf", "doc", "docx", "txt"].includes(extension || "")) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="attachments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lampiran</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPending || isUploading}
                    className="gap-2"
                  >
                    <Paperclip className="h-4 w-4" />
                    <span>Tambah Lampiran</span>
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    key={fileInputKey}
                    className="hidden"
                    onChange={handleAttachmentUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  {isUploading && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span>Mengunggah...</span>
                    </div>
                  )}
                </div>

                {/* Attachment List */}
                {attachments.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {attachments.map((attachment, index) => {
                      const filename = attachment.split("/").pop() || "file";
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            {getFileIcon(filename)}
                            <span className="text-sm font-medium">
                              {filename}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500"
                            onClick={() => {
                              const newAttachments = [...attachments];
                              newAttachments.splice(index, 1);
                              field.onChange(newAttachments);
                            }}
                            disabled={isPending}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Hapus</span>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-6 border border-dashed rounded-md">
                    <Paperclip className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Belum ada lampiran. Tambahkan foto atau dokumen terkait
                      servis.
                    </p>
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              Unggah foto kerusakan, bukti pembelian, atau dokumen lainnya
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AttachmentsSection;
