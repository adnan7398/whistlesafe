import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

// Register plugins
registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

interface MediaUploadProps {
  onUploadComplete: (mediaIds: string[]) => void;
  reportId?: string;
  uuid: string;
}

export default function MediaUpload({ onUploadComplete, reportId, uuid }: MediaUploadProps) {
  const [files, setFiles] = useState<any[]>([]);

  const handleProcessFile = async (fieldName, file, metadata, load, error) => {
    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('uuid', uuid);
      if (reportId) {
        formData.append('reportId', reportId);
      }

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      load(data.media.id);
      onUploadComplete([...files.map(f => f.serverId), data.media.id]);
    } catch (err) {
      error('Upload failed');
      toast.error('Failed to upload media');
    }
  };

  return (
    <div className="w-full">
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={true}
        maxFiles={5}
        server={{
          process: handleProcessFile,
        }}
        name="media"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        acceptedFileTypes={['image/*', 'video/mp4']}
        maxFileSize="10MB"
        credits={false}
      />
    </div>
  );
} 