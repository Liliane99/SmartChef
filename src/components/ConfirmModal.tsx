"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ReactNode, useState } from "react";

type ConfirmDialogProps = {
  title: string;
  description?: string;
  trigger: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  title,
  description,
  trigger,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
}: ConfirmDialogProps) {

  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed z-50 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 w-[90vw] max-w-md shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-muted hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {description && (
            <p className="text-muted-foreground mb-6">{description}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={handleConfirm}
              className="btn-danger"
            >
              {confirmLabel}
            </button>
            <Dialog.Close asChild>
              <button className="btn-secondary">{cancelLabel}</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
