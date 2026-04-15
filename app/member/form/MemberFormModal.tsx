"use client";

import type React from "react";
import type { CreateMemberDto } from "../dto";

interface MemberFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  formData: CreateMemberDto;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (value: CreateMemberDto) => void;
}

export default function MemberFormModal(props: MemberFormModalProps) {
  const { isOpen, mode, formData, isSubmitting, onClose, onSubmit, onChange } = props;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h4 className="mb-4 text-lg font-semibold text-slate-900">
          {mode === "create" ? "Tambah Member" : "Edit Member"}
        </h4>
        <form className="space-y-3" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Kode Member
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) => onChange({ ...formData, code: event.target.value })}
              placeholder="Contoh: M001"
              required
              type="text"
              value={formData.code}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Nama Member
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) => onChange({ ...formData, name: event.target.value })}
              placeholder="Masukkan nama"
              required
              type="text"
              value={formData.name}
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
