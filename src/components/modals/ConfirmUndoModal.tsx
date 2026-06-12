"use client";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  itemName: string;
  onUndoCurrent: () => void;
  onFutureOnly: () => void;
}

export default function ConfirmUndoModal({ open, onClose, title, itemName, onUndoCurrent, onFutureOnly }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200/60 rounded-xl">
          <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              &ldquo;{itemName}&rdquo; sudah mempengaruhi saldo bulan berjalan.
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Bulan yang sudah lewat tidak terpengaruh.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            fullWidth
            variant="danger"
            onClick={() => { onUndoCurrent(); onClose(); }}
          >
            Batalkan & Undo Saldo Bulan Ini
          </Button>
          <Button
            fullWidth
            variant="outline"
            onClick={() => { onFutureOnly(); onClose(); }}
          >
            Hanya Hapus untuk Bulan Depan
          </Button>
        </div>
      </div>
    </Modal>
  );
}
