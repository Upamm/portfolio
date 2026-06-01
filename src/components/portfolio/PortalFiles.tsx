'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Image,
  FileArchive,
  File,
  Download,
  Trash2,
  Inbox,
  Loader2,
  X,
  CloudUpload,
} from 'lucide-react';

type FileCategory = 'all' | 'general' | 'project' | 'invoice' | 'contract';

interface PortalFile {
  id: string;
  filename: string;
  filetype: string;
  size: number;
  uploadDate: string;
  category: string;
  url?: string;
  clientUploaded?: boolean;
}

const categoryFilters: { key: FileCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'general', label: 'General' },
  { key: 'project', label: 'Project' },
  { key: 'invoice', label: 'Invoice' },
  { key: 'contract', label: 'Contract' },
];

const categoryStyles: Record<string, string> = {
  general: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
  project: 'bg-teal-500/15 text-teal-400 border-teal-500/25',
  invoice: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  contract: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
};

const getFileIcon = (filetype: string) => {
  const ext = filetype.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return Image;
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return FileArchive;
  if (['pdf'].includes(ext)) return FileText;
  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatDate = (d: string) => {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return d;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function PortalFiles() {
  const [files, setFiles] = useState<PortalFile[]>([]);
  const [filter, setFilter] = useState<FileCategory>('all');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/portal/files', { headers });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.files || [];
        setFiles(
          list.map((f: Record<string, unknown>, i: number) => ({
            id: String(f.id || i),
            filename: (f.filename as string) || (f.name as string) || 'File',
            filetype: (f.filetype as string) || (f.type as string) || 'pdf',
            size: Number(f.size) || 0,
            uploadDate: (f.uploadDate as string) || (f.upload_date as string) || (f.createdAt as string) || '',
            category: (f.category as string) || 'general',
            url: (f.url as string) || '',
            clientUploaded: Boolean(f.clientUploaded ?? f.client_uploaded),
          }))
        );
      }
    } catch {
      // Fallback demo data
      setFiles([
        { id: '1', filename: 'project-brief.pdf', filetype: 'pdf', size: 245000, uploadDate: '2025-06-15', category: 'project', clientUploaded: true },
        { id: '2', filename: 'brand-guidelines.pdf', filetype: 'pdf', size: 1500000, uploadDate: '2025-06-18', category: 'general', url: '', clientUploaded: false },
        { id: '3', filename: 'wireframe-v2.png', filetype: 'png', size: 890000, uploadDate: '2025-06-20', category: 'project', url: '', clientUploaded: false },
        { id: '4', filename: 'contract-agreement.pdf', filetype: 'pdf', size: 520000, uploadDate: '2025-05-30', category: 'contract', url: '', clientUploaded: false },
        { id: '5', filename: 'invoice-0042.pdf', filetype: 'pdf', size: 88000, uploadDate: '2025-06-15', category: 'invoice', url: '', clientUploaded: false },
        { id: '6', filename: 'website-assets.zip', filetype: 'zip', size: 15000000, uploadDate: '2025-06-22', category: 'project', url: '', clientUploaded: false },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const filtered = filter === 'all' ? files : files.filter(f => f.category.toLowerCase() === filter);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('portal_token='))
      ?.split('=')[1];

    const formData = new FormData();
    Array.from(fileList).forEach(f => formData.append('files', f));

    try {
      // Simulate progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 20, 90);
        setUploadProgress(Math.round(progress));
      }, 200);

      const res = await fetch('/api/portal/files', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      clearInterval(progressInterval);

      if (res.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          fetchFiles();
          setUploadProgress(0);
        }, 500);
      } else {
        // Optimistically add files
        Array.from(fileList).forEach(f => {
          const ext = f.name.split('.').pop() || 'file';
          setFiles(prev => [
            {
              id: Date.now().toString() + Math.random().toString(36).slice(2),
              filename: f.name,
              filetype: ext,
              size: f.size,
              uploadDate: new Date().toISOString(),
              category: 'general',
              clientUploaded: true,
            },
            ...prev,
          ]);
        });
        setUploadProgress(0);
      }
    } catch {
      // Optimistically add files
      Array.from(fileList).forEach(f => {
        const ext = f.name.split('.').pop() || 'file';
        setFiles(prev => [
          {
            id: Date.now().toString() + Math.random().toString(36).slice(2),
            filename: f.name,
            filetype: ext,
            size: f.size,
            uploadDate: new Date().toISOString(),
            category: 'general',
            clientUploaded: true,
          },
          ...prev,
        ]);
      });
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDelete = async (fileId: string) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`/api/portal/files/${fileId}`, { method: 'DELETE', headers });
    } catch {
      // ignore
    }
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-40 rounded-xl bg-white/5 animate-pulse" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-400" />
            Files
          </h1>
          <p className="text-slate-400 text-sm mt-1">{files.length} file{files.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-card rounded-xl p-8 text-center border-2 border-dashed transition-all duration-300 cursor-pointer ${
          dragActive
            ? 'border-teal-500 bg-teal-500/5'
            : 'border-white/10 hover:border-teal-500/30 hover:bg-teal-500/5'
        }`}
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={e => handleUpload(e.target.files)}
        />
        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="w-10 h-10 text-teal-400 animate-spin mx-auto" />
            <p className="text-white text-sm font-medium">Uploading...</p>
            <div className="max-w-xs mx-auto">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-slate-500 text-xs mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 flex items-center justify-center mx-auto">
              <CloudUpload className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {dragActive ? 'Drop files here' : 'Drag & drop files or click to browse'}
              </p>
              <p className="text-slate-500 text-xs mt-1">Supports all file types up to 50MB</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Upload Progress Bar (persistent) */}
      <AnimatePresence>
        {uploading && uploadProgress > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <Loader2 className="w-4 h-4 text-teal-400 animate-spin flex-shrink-0" />
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <span className="text-teal-400 text-xs font-medium">{uploadProgress}%</span>
              <button
                onClick={(e) => { e.stopPropagation(); setUploadProgress(0); setUploading(false); }}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categoryFilters.map(cf => (
          <button
            key={cf.key}
            onClick={() => setFilter(cf.key)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === cf.key
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/30'
            }`}
          >
            {cf.label}
          </button>
        ))}
      </div>

      {/* File List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl p-12 text-center"
        >
          <Inbox className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No files found</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {filtered.map(file => {
            const Icon = getFileIcon(file.filetype);
            return (
              <motion.div
                key={file.id}
                variants={itemVariants}
                className="glass-card rounded-xl p-4 flex items-center gap-4 group hover-glow"
              >
                {/* File Icon */}
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-teal-400" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{file.filename}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.uploadDate)}</span>
                    <span className={`px-2 py-0.5 rounded-md border text-xs font-medium ${categoryStyles[file.category.toLowerCase()] || categoryStyles.general}`}>
                      {file.category}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {file.clientUploaded && (
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
