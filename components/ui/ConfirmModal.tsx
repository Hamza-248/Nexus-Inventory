import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-zinc-800"
      >
        <div className="p-6 text-center">
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full mb-4 ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-primary-100 text-primary-600'}`}>
                {variant === 'danger' ? <AlertTriangle size={24} /> : <Info size={24} />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
            
            <div className="flex items-center justify-center space-x-3">
                <Button variant="secondary" onClick={onClose} className="w-full">
                    {cancelText}
                </Button>
                <Button variant={variant} onClick={() => { onConfirm(); onClose(); }} className="w-full">
                    {confirmText}
                </Button>
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};