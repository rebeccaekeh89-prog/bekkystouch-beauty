import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Camera, CheckCircle2, Sparkles, AlertCircle, BookOpen, Download } from 'lucide-react';
import { Product } from '../types';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProductImage: (productId: number, newImageUrl: string) => Promise<void>;
  onUpdatePhilosophyImage?: (newImageUrl: string) => Promise<void>;
  philosophyImage?: string;
  initialTarget?: 'philosophy' | number | null;
}

export function ImageUploadModal({
  isOpen,
  onClose,
  products,
  onUpdateProductImage,
  onUpdatePhilosophyImage,
  philosophyImage = '/philosophy.jpg',
  initialTarget,
}: ImageUploadModalProps) {
  const [selectedTarget, setSelectedTarget] = useState<'philosophy' | number>(
    initialTarget === 'philosophy'
      ? 'philosophy'
      : (typeof initialTarget === 'number'
          ? initialTarget
          : (products.find(p => p.name === 'Cloud Blush')?.id || products[0]?.id || 1))
  );

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialTarget !== undefined && initialTarget !== null) {
      setSelectedTarget(initialTarget);
      setSelectedFile(null);
      setPreviewUrl(null);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [initialTarget, isOpen]);

  if (!isOpen) return null;

  const isPhilosophy = selectedTarget === 'philosophy';
  const currentProduct = !isPhilosophy
    ? (products.find(p => p.id === selectedTarget) || products[0])
    : null;

  const currentImageSrc = isPhilosophy
    ? philosophyImage
    : (currentProduct?.image || '');

  const targetTitle = isPhilosophy
    ? 'Our Philosophy & Craft Showcase'
    : (currentProduct?.name || 'Product');

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (.jpg, .jpeg, .png, .webp).');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    if (!selectedFile || !previewUrl) return;

    setUploading(true);
    setErrorMsg(null);

    let targetFilename = 'custom-image.jpg';
    if (isPhilosophy) {
      targetFilename = 'philosophy.jpg';
    } else if (currentProduct) {
      if (currentProduct.name === 'Cloud Blush') targetFilename = 'cloud-blush.jpg';
      else if (currentProduct.name === 'Brighten Concealer') targetFilename = 'brighten-concealer.jpg';
      else targetFilename = `${currentProduct.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
    }

    try {
      if (isPhilosophy && onUpdatePhilosophyImage) {
        await onUpdatePhilosophyImage(previewUrl);
        setSuccessMsg('Successfully updated Philosophy & Craft photo!');
      } else if (currentProduct) {
        await onUpdateProductImage(currentProduct.id, previewUrl);
        setSuccessMsg(`Successfully updated photo for ${currentProduct.name}!`);
      }

      setTimeout(() => {
        setSuccessMsg(null);
        setSelectedFile(null);
        setPreviewUrl(null);
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FBF9F5]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100/70 text-amber-900 rounded-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">Upload Storefront Photos</h2>
              <p className="text-xs text-stone-500">Update product photos or the Philosophy & Craft image</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Target Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
              Select What You Want to Update
            </label>

            {/* Quick target buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
              {/* Philosophy & Craft */}
              <button
                type="button"
                onClick={() => {
                  setSelectedTarget('philosophy');
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  selectedTarget === 'philosophy'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                    : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-800'
                }`}
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/20 shrink-0 border border-stone-200">
                  <img src={philosophyImage} alt="Philosophy" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-xs font-bold truncate">Philosophy & Craft</p>
                  <p className={`text-[10px] truncate ${selectedTarget === 'philosophy' ? 'text-stone-300' : 'text-stone-500'}`}>
                    Main editorial image
                  </p>
                </div>
              </button>

              {/* Cloud Blush */}
              {products
                .filter(p => p.name === 'Cloud Blush' || p.name === 'Brighten Concealer')
                .map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedTarget(p.id);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      selectedTarget === p.id
                        ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                        : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-800'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/20 shrink-0 border border-stone-200">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif text-xs font-bold truncate">{p.name}</p>
                      <p className={`text-[10px] truncate ${selectedTarget === p.id ? 'text-stone-300' : 'text-stone-500'}`}>
                        {p.name === 'Cloud Blush' ? 'Cloud blush .jpg' : 'Concealer.jpg'}
                      </p>
                    </div>
                  </button>
                ))}
            </div>

            {/* Other Products Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 whitespace-nowrap">Other items:</span>
              <select
                value={typeof selectedTarget === 'number' ? selectedTarget : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedTarget(Number(e.target.value));
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }
                }}
                className="w-full text-xs font-medium bg-[#F9F7F3] border border-stone-300 rounded-lg px-3 py-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="" disabled>-- Or select any catalog product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category}) — £{p.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current vs New Image Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Current Photo
              </span>
              <div className={`${isPhilosophy ? 'aspect-[4/3]' : 'aspect-square'} bg-stone-100 rounded-xl overflow-hidden border border-stone-200 relative`}>
                <img
                  src={currentImageSrc}
                  alt={targetTitle}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                  Active
                </span>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                New Photo Preview
              </span>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`${isPhilosophy ? 'aspect-[4/3]' : 'aspect-square'} rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all ${
                  previewUrl
                    ? 'border-emerald-600 bg-emerald-50/20'
                    : 'border-stone-300 bg-stone-50/70 hover:bg-stone-100/70 hover:border-stone-400'
                }`}
              >
                {previewUrl ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      Click to change
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="p-3 bg-white rounded-full shadow-xs mb-2 text-stone-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-stone-800">
                      Choose picture for {isPhilosophy ? 'Philosophy & Craft' : targetTitle}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-1">or drag & drop file here</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Instant Live Update</p>
              <p className="text-[11px] text-amber-900 mt-0.5">
                Saving will replace the photo immediately across the live site and remember your image for future visits.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-[#FBF9F5] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
            {previewUrl && (
              <a
                href={previewUrl}
                download={isPhilosophy ? 'philosophy.jpg' : `${currentProduct?.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'photo'}.jpg`}
                className="px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Download this image directly to your device"
              >
                <Download className="w-3.5 h-3.5 text-stone-600" />
                <span>Download File</span>
              </a>
            )}
          </div>
          <button
            type="button"
            disabled={!previewUrl || uploading}
            onClick={handleSave}
            className="px-5 py-2 bg-[#1E1B18] text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {uploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Applying Image...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply New Image</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
