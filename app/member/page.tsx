"use client";

import React, { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import type { CreateMemberDto, MemberDto } from "./dto";
import DeleteMemberModal from "./form/DeleteMemberModal";
import MemberFormModal from "./form/MemberFormModal";
import {
  createMember,
  deleteMember,
  getMemberList,
  updateMember,
} from "./service";

export default function MemberPage() {
  const [members, setMembers] = useState<MemberDto[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateMemberDto>({ code: "", name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<MemberDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchMembers(searchValue = "", page = 1, limit = rowsPerPage) {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await getMemberList({ page, limit, search: searchValue });
      setMembers(response.data);
      setCurrentPage(response.meta?.page ?? page);
      setTotalPages(response.meta?.totalPages ?? 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal memuat data member."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchMembers(search.trim(), currentPage, rowsPerPage);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [search, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage]);

  function openCreateModal() {
    setModalMode("create");
    setEditingMemberId(null);
    setFormData({ code: "", name: "" });
    setIsFormModalOpen(true);
  }

  function openEditModal(member: MemberDto) {
    setModalMode("edit");
    setEditingMemberId(member.id);
    setFormData({ code: member.code, name: member.name });
    setIsFormModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setFeedbackMessage("");
    try {
      if (modalMode === "create") {
        await createMember(formData);
        setFeedbackMessage("Member berhasil ditambahkan.");
      } else if (editingMemberId !== null) {
        await updateMember(editingMemberId, formData);
        setFeedbackMessage("Member berhasil diubah.");
      }
      setIsFormModalOpen(false);
      await fetchMembers(search.trim(), currentPage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menyimpan data member."
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
      await deleteMember(deleteTarget.id);
      setDeleteTarget(null);
      setFeedbackMessage("Member berhasil dihapus.");
      await fetchMembers(search.trim(), currentPage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menghapus member."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AppShell>
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Tabel Member</h3>
          <div className="flex items-center gap-2">
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search member..."
              type="text"
              value={search}
            />
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
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {errorMessage ? (
                <tr>
                  <td className="px-4 py-4 text-rose-600" colSpan={4}>
                    {errorMessage}
                  </td>
                </tr>
              ) : null}
              {isLoading ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={4}>
                    Memuat data member...
                  </td>
                </tr>
              ) : null}
              {!errorMessage && !isLoading && members.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={4}>
                    Data member belum tersedia.
                  </td>
                </tr>
              ) : null}
              {members.map((member) => (
                <tr className="text-slate-700" key={member.id}>
                  <td className="px-4 py-3">{member.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{member.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="rounded-md bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600"
                        onClick={() => openEditModal(member)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700"
                        onClick={() => setDeleteTarget(member)}
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

      <MemberFormModal
        formData={formData}
        isOpen={isFormModalOpen}
        isSubmitting={isSubmitting}
        mode={modalMode}
        onChange={setFormData}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmit}
      />
      <DeleteMemberModal
        isDeleting={isDeleting}
        isOpen={Boolean(deleteTarget)}
        name={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </AppShell>
  );
}
