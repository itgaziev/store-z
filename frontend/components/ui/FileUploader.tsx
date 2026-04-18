'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
    label?: string;
    onFileChange: (files: File[]) => void;
    maxFiles?: number;
    existingImages?: string[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    label = "Upload Images",
    onFileChange,
    maxFiles = 5,
    existingImages = [],
}) => {
    const [previews, setPreviews] = useState<string[]>(existingImages);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = useCallback((files: FileList | null) => {
        if (!files) return;

        const newFiles = Array.from(files).slice(0, maxFiles - previews.length);
        const newPreivews = newFiles.map(file => URL.createObjectURL(file));

        setPreviews(prev => [...prev, ...newPreivews]);
        if (onFileChange) {
            onFileChange(newFiles);
        }
    }, [maxFiles, onFileChange, previews.length]);

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeImage = (index: number) => {
        setPreviews(prev => {
            const filtered = prev.filter((_, i) => i !== index);
            return filtered;
        });
    };

    return (
        <div className='space-y-3'>
            { label && <label className='text-sm font-medium text-slate-700'>{label}</label> }

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                {previews.map((src, index) => (
                    <div key={index} className='
                        relative group aspect-square 
                        rounded-xl border border-slate-200 overflow-hidden bg-slate-50'
                    >
                        <img src={src} alt={`Preview ${index}`} className='object-cover w-full h-full' />
                        <button
                            type='button'
                            onClick={() => removeImage(index)}
                            className='
                                absolute top-1 right-1 p-1 bg-white/80 hover:bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity
                            '>
                                <X className='w-4 h-4'/>
                            </button>
                    </div>
                ))}

                {previews.length < maxFiles && (
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={cn(
                            'relative aspect-square rounded-xl border-2 border-dashed flex-col items-center justify-center cursor-pointer transition-colors',
                            isDragging 
                                ? 'border-blue-500 bg-blue-50 text-blue-600' 
                                : 'border-slate-300 hover:border-slate-300 hover:bg-slate-50 text-slate-400'
                        )}
                    >
                        <Upload className='w-6 h-6 mb-2' />
                        <span className='text-xs'>Drag & Drop or Click to Upload</span>
                        <input
                            id='file-upload'
                            type='file'
                            accept='image/*'
                            multiple
                            className='hidden'
                            onChange={(e) => handleFiles(e.target.files)}
                        />
                    </div>
                )}
            </div>

            <p className='text-xs text-slate-400'>You can upload up to {maxFiles} images.</p>
        </div>
    );
}
