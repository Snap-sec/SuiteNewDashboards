import { useCallback, useState } from 'react';

let idCounter = 0;

function generateId() {
  return ++idCounter;
}

export function useFileUpload({ maxFiles = 3, maxSize = 2 * 1024 * 1024, accept = 'image/*', multiple = true, onFilesChange }) {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Determine if a file matches the provided accept string (comma-separated list)
  const isAccepted = (file) => {
    if (!accept) return true;

    const tokens = accept
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const fileType = (file.type || '').toLowerCase();
    const fileName = (file.name || '').toLowerCase();

    // If the browser didn't provide a MIME type, rely on extension matching
    for (const token of tokens) {
      if (token.startsWith('.')) {
        if (fileName.endsWith(token)) return true;
        continue;
      }

      // Wildcard like image/*
      if (token.endsWith('/*')) {
        const base = token.slice(0, -1); // keep trailing '/'
        if (fileType.startsWith(base)) return true;
        continue;
      }

      // Exact mime type like application/pdf
      if (fileType === token) return true;
    }

    return false;
  };

  const validateFiles = (selectedFiles) => {
    const newErrors = [];
    const validFiles = [];

    for (const file of selectedFiles) {
      if (file.size > maxSize) {
        newErrors.push(`${file.name} exceeds the maximum size of ${formatBytes(maxSize)}`);
        continue;
      }

      if (!isAccepted(file)) {
        newErrors.push(`${file.name} is not a valid file type`);
        continue;
      }

      const fileWithPreview = {
        id: generateId(),
        file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      };

      validFiles.push(fileWithPreview);
    }

    return { validFiles, newErrors };
  };

  const addFiles = (newSelectedFiles) => {
    let selected = multiple ? [...newSelectedFiles] : [newSelectedFiles[0]];
    const { validFiles, newErrors } = validateFiles(selected);

    const combined = [...files, ...validFiles].slice(0, maxFiles);
    setFiles(combined);
    setErrors(newErrors);

    if (onFilesChange) {
      onFilesChange(combined);
    }
  };

  const removeFile = (id) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    if (onFilesChange) onFilesChange(updated);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);
  const handleDragOver = (e) => e.preventDefault();
  const openFileDialog = () => {
    document.getElementById('file-upload-hidden-input')?.click();
  };

  const getInputProps = () => ({
    id: 'file-upload-hidden-input',
    type: 'file',
    multiple,
    accept,
    onChange: (e) => {
      const inputFiles = Array.from(e.target.files);
      addFiles(inputFiles);
    },
  });

  return [
    { files, errors, isDragging },
    { removeFile, handleDrop, handleDragEnter, handleDragLeave, handleDragOver, openFileDialog, getInputProps },
  ];
}

// Reuse utility for file size
export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
