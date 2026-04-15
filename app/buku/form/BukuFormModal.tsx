"use client";

import type React from "react";
import type { CreateBukuDto } from "../dto";

interface BukuFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  formData: CreateBukuDto;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (value: CreateBukuDto) => void;
}

export default function BukuFormModal(props: BukuFormModalProps) {
  const { isOpen, mode, formData, isSubmitting, onClose, onSubmit, onChange } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h4 className="mb-4 text-lg font-semibold text-slate-900">
          {mode === "create" ? "Tambah Buku" : "Edit Buku"}
        </h4>
        <form className="space-y-3" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Kode Buku
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) => onChange({ ...formData, code: event.target.value })}
              placeholder="Contoh: BK001"
              required
              type="text"
              value={formData.code}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Judul Buku
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) => onChange({ ...formData, title: event.target.value })}
              placeholder="Masukkan judul"
              required
              type="text"
              value={formData.title}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Penulis
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) => onChange({ ...formData, author: event.target.value })}
              placeholder="Masukkan penulis"
              required
              type="text"
              value={formData.author}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Stok
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              min={0}
              onChange={(event) =>
                onChange({ ...formData, stock: Number(event.target.value || 0) })
              }
              placeholder="0"
              required
              type="number"
              value={formData.stock}
            />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              onClick={onClose}
              type="button"
            >
              Batal
            </button>
            <button
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
