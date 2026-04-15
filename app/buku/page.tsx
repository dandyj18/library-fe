"use client";

import AppShell from "../components/AppShell";
import React, { useEffect, useState } from "react";
import type { BukuDto, CreateBukuDto } from "./dto";
import DeleteBukuModal from "./form/DeleteBukuModal";
import BukuFormModal from "./form/BukuFormModal";
import { createBuku, deleteBuku, getBukuList, updateBuku } from "./service";

type ModalMode = "create" | "edit";

const EMPTY_FORM: CreateBukuDto = {
  code: "",
  title: "",
  author: "",
  stock: 0,
};

export default function BukuPage() {
  const [books, setBooks] = useState<BukuDto[]>([]);
  const [search, setSearch] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateBukuDto>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<BukuDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchBooks(
    searchValue = "",
    page = 1,
    availableOnly = false,
    limit = rowsPerPage
  ) {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await getBukuList({
        page,
        limit,
        search: searchValue,
        filters: "stock!=0",
      });
      setBooks(response.data);
      setCurrentPage(response.meta?.page ?? page);
      setTotalPages(response.meta?.totalPages ?? 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal memuat data buku."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchBooks(search.trim(), currentPage, showAvailableOnly, rowsPerPage);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [search, currentPage, showAvailableOnly, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, showAvailableOnly, rowsPerPage]);

  function openCreateModal() {
    setModalMode("create");
    setEditingBookId(null);
    setFormData(EMPTY_FORM);
    setFeedbackMessage("");
    setIsFormModalOpen(true);
  }

  function openEditModal(book: BukuDto) {
    setModalMode("edit");
    setEditingBookId(book.id);
    setFormData({
      code: book.code,
      title: book.title,
      author: book.author,
      stock: book.stock,
    });
    setFeedbackMessage("");
    setIsFormModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setFeedbackMessage("");

    try {
      if (modalMode === "create") {
        await createBuku(formData);
        setFeedbackMessage("Buku berhasil ditambahkan.");
      } else if (editingBookId !== null) {
        await updateBuku(editingBookId, formData);
        setFeedbackMessage("Buku berhasil diubah.");
      }

      setIsFormModalOpen(false);
      await fetchBooks(search.trim(), currentPage, showAvailableOnly);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menyimpan data buku."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setErrorMessage("");
    setFeedbackMessage("");
    try {
      await deleteBuku(deleteTarget.id);
      setDeleteTarget(null);
      setFeedbackMessage("Buku berhasil dihapus.");
      await fetchBooks(search.trim(), currentPage, showAvailableOnly);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menghapus buku."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AppShell>
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Tabel Buku</h3>
          <div className="flex items-center gap-2">
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search buku..."
              type="text"
              value={search}
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                checked={showAvailableOnly}
                onChange={(event) => setShowAvailableOnly(event.target.checked)}
                type="checkbox"
              />
              Stok tersedia
            </label>
            <button
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              onClick={openCreateModal}
              type="button"
            >
              Tambah
            </button>
          </div>
        </div>
        {feedbackMessage ? (
          <p className="mb-3 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {feedbackMessage}
          </p>
        ) : null}

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Judul</th>
                <th className="px-4 py-3 font-semibold">Penulis</th>
                <th className="px-4 py-3 font-semibold">Stok</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {errorMessage ? (
                <tr>
                  <td className="px-4 py-4 text-rose-600" colSpan={6}>
                    {errorMessage}
                  </td>
                </tr>
              ) : null}
              {isLoading ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={6}>
                    Memuat data buku...
                  </td>
                </tr>
              ) : null}
              {!errorMessage && !isLoading && books.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={6}>
                    Data buku belum tersedia.
                  </td>
                </tr>
              ) : null}
              {books.map((book) => (
                <tr className="text-slate-700" key={book.id}>
                  <td className="px-4 py-3">{book.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{book.title}</td>
                  <td className="px-4 py-3">{book.author}</td>
                  <td className="px-4 py-3">{book.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="rounded-md bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600"
                        onClick={() => openEditModal(book)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700"
                        onClick={() => setDeleteTarget(book)}
                        type="button"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <span>Per halaman</span>
            <select
              className="rounded-lg border border-slate-300 px-2 py-1"
              onChange={(event) => setRowsPerPage(Number(event.target.value))}
              value={rowsPerPage}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:opacity-50"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              type="button"
            >
              Prev
            </button>
            <span className="text-sm text-slate-600">
              Halaman {currentPage} / {Math.max(totalPages, 1)}
            </span>
            <button
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:opacity-50"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, Math.max(totalPages, 1)))
              }
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <BukuFormModal
        formData={formData}
        isOpen={isFormModalOpen}
        isSubmitting={isSubmitting}
        mode={modalMode}
        onChange={setFormData}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
      />
      <DeleteBukuModal
        isDeleting={isDeleting}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
        title={deleteTarget?.title ?? ""}
      />
    </AppShell>
  );
}
