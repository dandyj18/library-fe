"use client";

interface ReturnPeminjamanModalProps {
  isOpen: boolean;
  memberOptions: Array<{
    id: number;
    label: string;
  }>;
  selectedMemberId: number | null;
  activeBorrowings: Array<{
    id: number;
    label: string;
    returnDate: string;
  }>;
  submittingBorrowingId: number | null;
  onClose: () => void;
  onSelectMemberId: (id: number | null) => void;
  onChangeReturnDate: (id: number, value: string) => void;
  onConfirm: (id: number) => void;
}

export default function ReturnPeminjamanModal(props: ReturnPeminjamanModalProps) {
  const {
    isOpen,
    memberOptions,
    selectedMemberId,
    activeBorrowings,
    submittingBorrowingId,
    onClose,
    onSelectMemberId,
    onChangeReturnDate,
    onConfirm,
  } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h4 className="mb-2 text-lg font-semibold text-slate-900">Pengembalian Buku</h4>
        <p className="mb-3 text-sm text-slate-600">Isi tanggal pengembalian satu per satu.</p>
        <label className="mb-3 block text-sm font-medium text-slate-700">
          Pilih Member
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            onChange={(event) => onSelectMemberId(Number(event.target.value) || null)}
            value={selectedMemberId ?? ""}
          >
            <option value="">Pilih member</option>
            {memberOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <div className="mb-4 max-h-80 space-y-2 overflow-auto">
          {!selectedMemberId ? (
            <p className="text-sm text-slate-500">Pilih member untuk menampilkan daftar pinjaman.</p>
          ) : null}
          {selectedMemberId && activeBorrowings.length === 0 ? (
            <p className="text-sm text-slate-500">Tidak ada peminjaman aktif.</p>
          ) : null}
          {activeBorrowings.map((item) => (
            <div className="rounded-lg border border-slate-200 p-3" key={item.id}>
              <p className="mb-2 text-sm text-slate-700">{item.label}</p>
              <div className="flex items-center gap-2">
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  onChange={(event) => onChangeReturnDate(item.id, event.target.value)}
                  type="date"
                  value={item.returnDate}
                />
                <button
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  disabled={submittingBorrowingId !== null || !item.returnDate}
                  onClick={() => onConfirm(item.id)}
                  type="button"
                >
                  {submittingBorrowingId === item.id ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
