"use client";

interface DeleteMemberModalProps {
  isOpen: boolean;
  name: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMemberModal(props: DeleteMemberModalProps) {
  const { isOpen, name, isDeleting, onClose, onConfirm } = props;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h4 className="mb-2 text-lg font-semibold text-slate-900">Hapus Member</h4>
        <p className="mb-4 text-sm text-slate-600">
          Yakin ingin menghapus member <strong>{name}</strong>?
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            Batal
          </button>
          <button
            className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
