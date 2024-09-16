import React from 'react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded mr-2"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
