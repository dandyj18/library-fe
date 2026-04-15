"use client";

import type React from "react";
import type { BukuDto } from "../../buku/dto";
import type { MemberDto } from "../../member/dto";
import type { CreatePeminjamanDto } from "../dto";

interface PeminjamanFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  formData: CreatePeminjamanDto;
  isSubmitting: boolean;
  memberSearch: string;
  bookSearch: string;
  selectedMemberLabel: string;
  selectedBookLabel: string;
  isMemberDropdownOpen: boolean;
  isBookDropdownOpen: boolean;
  members: MemberDto[];
  books: BukuDto[];
  getMemberLabel: (member: MemberDto) => string;
  getBookLabel: (book: BukuDto) => string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleMemberDropdown: () => void;
  onToggleBookDropdown: () => void;
  onMemberSearchChange: (value: string) => void;
  onBookSearchChange: (value: string) => void;
  onSelectMember: (member: MemberDto) => void;
  onSelectBook: (book: BukuDto) => void;
  selectedBooks: BukuDto[];
  onRemoveSelectedBook: (bookId: number) => void;
  onFormChange: (value: CreatePeminjamanDto) => void;
  isPenaltyBlocked: boolean;
  penaltyMessage: string;
}

export default function PeminjamanFormModal(props: PeminjamanFormModalProps) {
  const {
    isOpen,
    mode,
    formData,
    isSubmitting,
    memberSearch,
    bookSearch,
    selectedMemberLabel,
    selectedBookLabel,
    isMemberDropdownOpen,
    isBookDropdownOpen,
    members,
    books,
    getMemberLabel,
    getBookLabel,
    onClose,
    onSubmit,
    onToggleMemberDropdown,
    onToggleBookDropdown,
    onMemberSearchChange,
    onBookSearchChange,
    onSelectMember,
    onSelectBook,
    selectedBooks,
    onRemoveSelectedBook,
    onFormChange,
    isPenaltyBlocked,
    penaltyMessage,
  } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h4 className="mb-4 text-lg font-semibold text-slate-900">
          {mode === "create" ? "Tambah Peminjaman" : "Edit Peminjaman"}
        </h4>
        <form className="space-y-3" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Member
          </label>
          <div className="relative">
            <button
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-left text-sm text-slate-700"
              onClick={onToggleMemberDropdown}
              type="button"
            >
              {selectedMemberLabel || "Pilih Member"}
            </button>
            {isMemberDropdownOpen ? (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                <input
                  className="mb-2 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  onChange={(event) => onMemberSearchChange(event.target.value)}
                  placeholder="Cari member..."
                  type="text"
                  value={memberSearch}
                />
                <div className="max-h-40 overflow-auto">
                  {members.length === 0 ? (
                    <p className="px-2 py-1 text-xs text-slate-500">Data tidak ditemukan.</p>
                  ) : null}
                  {members.map((member) => (
                    <button
                      className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-slate-100"
                      key={member.id}
                      onClick={() => onSelectMember(member)}
                      type="button"
                    >
                      {getMemberLabel(member)}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <label className="block text-sm font-medium text-slate-700">
            Buku
          </label>
          <div className="relative">
            <button
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-left text-sm text-slate-700"
              onClick={onToggleBookDropdown}
              type="button"
            >
              {selectedBookLabel || "Pilih Buku"}
            </button>
            {isBookDropdownOpen ? (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                <input
                  className="mb-2 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
                  onChange={(event) => onBookSearchChange(event.target.value)}
                  placeholder="Cari buku..."
                  type="text"
                  value={bookSearch}
                />
                <div className="max-h-40 overflow-auto">
                  {books.length === 0 ? (
                    <p className="px-2 py-1 text-xs text-slate-500">Data tidak ditemukan.</p>
                  ) : null}
                  {books.map((book) => (
                    <button
                      className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-slate-100"
                      key={book.id}
                      onClick={() => onSelectBook(book)}
                      type="button"
                    >
                      {getBookLabel(book)}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {mode === "create" ? (
            <div className="rounded-lg border border-slate-200 p-2">
              <p className="mb-2 text-xs text-slate-500">Buku terpilih (maksimal 2)</p>
              {selectedBooks.length === 0 ? (
                <p className="text-sm text-slate-500">Belum ada buku dipilih.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedBooks.map((book) => (
                    <button
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
                      key={book.id}
                      onClick={() => onRemoveSelectedBook(book.id)}
                      type="button"
                    >
                      {getBookLabel(book)} x
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          <label className="block text-sm font-medium text-slate-700">
            Tanggal Peminjaman
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) =>
                onFormChange({ ...formData, borrow_date: event.target.value })
              }
              required
              type="date"
              value={formData.borrow_date}
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Tanggal Jatuh Tempo
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) => onFormChange({ ...formData, due_date: event.target.value })}
              required
              type="date"
              value={formData.due_date}
            />
          </label>
          {isPenaltyBlocked ? (
            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {penaltyMessage}
            </p>
          ) : null}
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
              disabled={isSubmitting || isPenaltyBlocked}
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
