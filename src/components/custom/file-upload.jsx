import React, { useState, useRef } from 'react';
import { Upload, X, File as FileIcon, Image, FileText, Music, Video, Archive, Code, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FileUpload = ({
  maxFiles = 5,
  variant = 'default',
  value = [],
  onFilesChange = () => { },
  acceptedTypes = "image/*,application/pdf,.doc,.docx,.txt",
  maxFileSize = 10 * 1024 * 1024 // 10MB default,
  ,isUploading = false
}) => {
  const [files, setFiles] = useState([]);

  // Sync with external value if provided
  React.useEffect(() => {
    if (value && value.length > 0) {
      const formattedFiles = value.map(file => ({
        id: file.id || Date.now() + Math.random(),
        file: file instanceof File ? file : file, // Handle both File objects and potential wrappers
        preview: file.type?.startsWith('image/') ? URL.createObjectURL(file) : null
      }));
      // Avoid infinite loop if reference is different but content is same-ish?
      // For simplicity, we just set it. 
      // But we need to be careful not to overwrite user interactions if onFilesChange triggers parent update which triggers this.
      // Ideally, we only set if local state is empty or if we want full control.
      // Let's check consistency:
      setFiles(prev => {
        // Simple check: if lengths are different, update. 
        // Realistically, to support controlled component properly, we should always trust 'value' if provided.
        return formattedFiles;
      });
    }
  }, [value]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const getFileIcon = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-4 h-4" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-4 h-4" />;
    if (type.includes('javascript') || type.includes('html') || type.includes('css')) return <Code className="w-4 h-4" />;
    return <FileIcon className="w-4 h-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = (newFiles) => {
    setError('');
    const fileArray = Array.from(newFiles);
    const validFiles = [];

    for (const file of fileArray) {
      if (file.size > maxFileSize) {
        setError(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxFileSize)}`);
        continue;
      }
      validFiles.push(file);
    }

    const totalFiles = files.length + validFiles.length;
    if (totalFiles > maxFiles) {
      setError(`Cannot upload more than ${maxFiles} files`);
      return;
    }

    const filesWithId = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    const updatedFiles = [...files, ...filesWithId];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.file));
  };

  const removeFile = (id) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.file));
    setError('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Default Variant - Clean Card Layout
  const DefaultVariant = () => (
    <div className="w-full space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/25'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
            <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary">Max {maxFiles} files</Badge>
              <Badge variant="secondary">Up to {formatFileSize(maxFileSize)}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Uploaded Files</span>
              <Badge variant="outline">{files.length}/{maxFiles}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 ">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {fileObj.preview ? (
                    <img src={fileObj.preview} alt={fileObj.file.name} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      {getFileIcon(fileObj.file)}
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-medium truncate">{fileObj.file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(fileObj.file.size)}</p>
                </div>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(fileObj.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );

  // Compact Variant - Inline Layout
  const CompactVariant = () => (
    <div className="w-full space-y-3">
      <Card>
        <CardContent className="p-4">
          <div
            className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${dragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/25'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <div className="flex items-center gap-3">
              <Upload className="w-6 h-6 text-muted-foreground flex-shrink-0" />
              <div className="flex-grow min-w-0">
                <p className="font-medium">Upload Files</p>
                <p className="text-sm text-muted-foreground">Max {maxFiles} files • {formatFileSize(maxFileSize)} each</p>
              </div>
              <Button size="sm" variant="secondary">
                Browse
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-2 max-h-100 kt-scrollable-x-auto">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0">
                  {fileObj.preview ? (
                    <img src={fileObj.preview} alt={fileObj.file.name} className="w-8 h-8 object-cover rounded" />
                  ) : (
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      {getFileIcon(fileObj.file)}
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium truncate">{fileObj.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(fileObj.file.size)}</p>
                </div>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(fileObj.id)}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </Button>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );

  // Premium Variant - Feature Rich with Progress
  const PremiumVariant = () => (
    <div className="w-full space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle>File Upload</CardTitle>
          <CardDescription>
            Upload up to {maxFiles} files, maximum {formatFileSize(maxFileSize)} each
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 cursor-pointer ${dragActive
              ? 'border-primary bg-primary/10 scale-[1.02]'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/25'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Upload Your Files</h3>
            <p className="text-muted-foreground mb-6">Drag and drop files here, or click to browse your computer</p>
            <div className="flex justify-center gap-4">
              <Badge variant="secondary">
                <FileIcon className="w-3 h-3 mr-1" />
                Max {maxFiles} files
              </Badge>
              <Badge variant="secondary">
                <Upload className="w-3 h-3 mr-1" />
                Up to {formatFileSize(maxFileSize)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Uploaded Files</CardTitle>
              <Badge className="px-3 py-1">
                {files.length} of {maxFiles} files
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((fileObj) => (
              <Card key={fileObj.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {fileObj.preview ? (
                      <img
                        src={fileObj.preview}
                        alt={fileObj.file.name}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center border">
                        {React.cloneElement(getFileIcon(fileObj.file), { className: "w-6 h-6 text-muted-foreground" })}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-semibold truncate mb-1">{fileObj.file.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{formatFileSize(fileObj.file.size)}</p>
                    <Progress value={100} className="h-2" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileObj.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );

  const variants = {
    default: DefaultVariant,
    compact: CompactVariant,
    premium: PremiumVariant
  };

  const SelectedVariant = variants[variant] || variants.default;

  return <SelectedVariant />;
};

// Demo component to showcase all variants
const FileUploadDemo = () => {
  const [currentVariant, setCurrentVariant] = useState('default');
  const [files, setFiles] = useState([]);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">File Upload Component</h1>
          <p className="text-xl text-muted-foreground mb-8">Built with shadcn/ui components for perfect theme integration</p>

          <div className="flex justify-center gap-4 mb-8">
            {[
              { key: 'default', label: 'Default', desc: 'Clean & Modern' },
              { key: 'compact', label: 'Compact', desc: 'Space Efficient' },
              { key: 'premium', label: 'Premium', desc: 'Feature Rich' }
            ].map(variant => (
              <Button
                key={variant.key}
                variant={currentVariant === variant.key ? "default" : "outline"}
                onClick={() => setCurrentVariant(variant.key)}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <div className="font-semibold">{variant.label}</div>
                <div className="text-xs opacity-75">{variant.desc}</div>
              </Button>
            ))}
          </div>
        </div>

        <Card className="p-6">
          <FileUpload
            variant={currentVariant}
            maxFiles={3}
            onFilesChange={setFiles}
            maxFileSize={5 * 1024 * 1024} // 5MB
          />
        </Card>

        {files.length > 0 && (
          <Card className="mt-6 p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileIcon className="w-4 h-4" />
              Files Selected:
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm">{file.name}</span>
                  <Badge variant="secondary">{(file.size / 1024).toFixed(1)} KB</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export { FileUpload, FileUploadDemo };