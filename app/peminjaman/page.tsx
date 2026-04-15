"use client";

import React, { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import type { BukuDto } from "../buku/dto";
import { getBukuList, updateBuku } from "../buku/service";
import type { MemberDto } from "../member/dto";
import { getMemberList } from "../member/service";
import type { CreatePeminjamanDto, PeminjamanDto } from "./dto";
import DeletePeminjamanModal from "./form/DeletePeminjamanModal";
import PeminjamanFormModal from "./form/PeminjamanFormModal";
import ReturnPeminjamanModal from "./form/ReturnPeminjamanModal";
import {
  createPeminjaman,
  deletePeminjaman,
  getPeminjamanList,
  updatePeminjaman,
} from "./service";

export default function PeminjamanPage() {
  const [borrowings, setBorrowings] = useState<PeminjamanDto[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<MemberDto[]>([]);
  const [books, setBooks] = useState<BukuDto[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [selectedMemberLabel, setSelectedMemberLabel] = useState("");
  const [selectedBookLabel, setSelectedBookLabel] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<BukuDto[]>([]);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingBorrowingId, setEditingBorrowingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreatePeminjamanDto>({
    member_id: 0,
    book_id: 0,
    borrow_date: "",
    return_date: null,
    due_date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PeminjamanDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [returnDates, setReturnDates] = useState<Record<number, string>>({});
  const [submittingReturnBorrowingId, setSubmittingReturnBorrowingId] = useState<number | null>(
    null
  );
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnMemberId, setSelectedReturnMemberId] = useState<number | null>(null);

  function getMemberLabel(member: MemberDto): string {
    return `${member.code} - ${member.name}`;
  }

  function getBookLabel(book: BukuDto): string {
    return `${book.code} - ${book.title}`;
  }

  async function syncBookStock(
    bookId: number,
    delta: number,
    bookCode?: string
  ): Promise<void> {
    let targetBook = books.find((book) => book.id === bookId);

    if (!targetBook && bookCode) {
      const lookup = await getBukuList({ page: 1, limit: 20, search: bookCode });
      targetBook = lookup.data.find((book) => book.id === bookId);
    }

    if (!targetBook) return;

    const nextStock = Math.max(0, (targetBook.stock ?? 0) + delta);
    await updateBuku(bookId, { stock: nextStock });
  }

  async function fetchBorrowings(page = 1, limit = rowsPerPage) {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await getPeminjamanList({ page, limit });
      setBorrowings(response.data);
      setCurrentPage(response.meta?.page ?? page);
      setTotalPages(response.meta?.totalPages ?? 1);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal memuat data peminjaman."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchMembersOptions(search = "") {
    try {
      const memberResponse = await getMemberList({
        page: 1,
        limit: 20,
        search,
      });
      setMembers(memberResponse.data);
    } catch {
      setMembers([]);
    }
  }

  async function fetchBooksOptions(search = "") {
    try {
      const bookResponse = await getBukuList({
        page: 1,
        limit: 20,
        search,
      });
      setBooks(bookResponse.data);
    } catch {
      setBooks([]);
    }
  }

  useEffect(() => {
    void fetchBorrowings(currentPage, rowsPerPage);
    void fetchMembersOptions();
    void fetchBooksOptions();
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rowsPerPage]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchMembersOptions(memberSearch.trim());
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [memberSearch]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchBooksOptions(bookSearch.trim());
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [bookSearch]);

  function openCreateModal() {
    setModalMode("create");
    setEditingBorrowingId(null);
    setFormData({
      member_id: 0,
      book_id: 0,
      borrow_date: "",
      return_date: null,
      due_date: "",
    });
    setMemberSearch("");
    setBookSearch("");
    setSelectedMemberLabel("");
    setSelectedBookLabel("");
    setSelectedBooks([]);
    setIsMemberDropdownOpen(false);
    setIsBookDropdownOpen(false);
    setIsFormModalOpen(true);
  }

  function openEditModal(borrowing: PeminjamanDto) {
    setModalMode("edit");
    setEditingBorrowingId(borrowing.id);
    setFormData({
      member_id: borrowing.member_id,
      book_id: borrowing.book_id,
      borrow_date: borrowing.borrow_date,
      return_date: borrowing.return_date,
      due_date: borrowing.due_date,
    });
    setMemberSearch("");
    setBookSearch("");
    setSelectedMemberLabel(
      borrowing.member ? `${borrowing.member.code} - ${borrowing.member.name}` : ""
    );
    setSelectedBookLabel(
      borrowing.book ? `${borrowing.book.code} - ${borrowing.book.title}` : ""
    );
    setSelectedBooks([]);
    setIsMemberDropdownOpen(false);
    setIsBookDropdownOpen(false);
    setIsFormModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setFeedbackMessage("");
    try {
      const createBookIds = selectedBooks.map((book) => book.id);
      if (modalMode === "create") {
        if (!formData.member_id || createBookIds.length === 0) {
          throw new Error("Pilih member dan minimal 1 buku.");
        }
      } else if (!formData.member_id || !formData.book_id) {
        throw new Error("Pilih member dan buku dari dropdown terlebih dahulu.");
      }

      const excludeId = modalMode === "edit" ? editingBorrowingId ?? undefined : undefined;
      const activeBorrowCount = getActiveBorrowCount(formData.member_id, excludeId);
      const isReturningNow = Boolean(formData.return_date);
      const incomingCount = modalMode === "create" ? createBookIds.length : 1;
      if (!isReturningNow && activeBorrowCount + incomingCount > 2) {
        throw new Error("Member ini sudah meminjam 2 buku dan belum mengembalikan.");
      }

      if (!isReturningNow) {
        const cooldownInfo = getBorrowingCooldownInfo(formData.member_id);
        if (cooldownInfo.isBlocked) {
          throw new Error(
            `Member ini sedang penalti dan tidak bisa meminjam sampai ${cooldownInfo.blockedUntil}.`
          );
        }
      }

      if (modalMode === "create") {
        for (const bookId of createBookIds) {
          const payload: CreatePeminjamanDto = {
            ...formData,
            book_id: bookId,
            return_date: formData.return_date || null,
          };
          await createPeminjaman(payload);
          await syncBookStock(bookId, -1);
        }
        setFeedbackMessage("Peminjaman berhasil ditambahkan.");
      } else if (editingBorrowingId !== null) {
        const payload: CreatePeminjamanDto = {
          ...formData,
          return_date: formData.return_date || null,
        };
        await updatePeminjaman(editingBorrowingId, payload);
        setFeedbackMessage("Peminjaman berhasil diubah.");
      }
      setIsFormModalOpen(false);
      await fetchBorrowings(currentPage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menyimpan data peminjaman."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function openReturnModal(borrowing: PeminjamanDto) {
    const today = new Date().toISOString().slice(0, 10);
    setReturnDates((prev) => ({ ...prev, [borrowing.id]: prev[borrowing.id] ?? today }));
    setSelectedReturnMemberId(borrowing.member_id);
    setIsReturnModalOpen(true);
  }

  function openQuickReturnModal() {
    setSelectedReturnMemberId(null);
    setIsReturnModalOpen(true);
  }

  async function handleReturnBook(borrowingId: number) {
    const returnDate = returnDates[borrowingId];
    if (!returnDate) return;
    const target = borrowings.find((item) => item.id === borrowingId);
    if (!target) return;

    setSubmittingReturnBorrowingId(borrowingId);
    setErrorMessage("");
    setFeedbackMessage("");
    try {
      await updatePeminjaman(borrowingId, {
        member_id: target.member_id,
        book_id: target.book_id,
        borrow_date: target.borrow_date,
        due_date: target.due_date,
        return_date: returnDate,
      });
      setReturnDates((prev) => {
        const next = { ...prev };
        delete next[borrowingId];
        return next;
      });
      await syncBookStock(target.book_id, 1, target.book?.code);
      setFeedbackMessage("Pengembalian berhasil disimpan.");
      await fetchBorrowings(currentPage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menyimpan pengembalian."
      );
    } finally {
      setSubmittingReturnBorrowingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMessage("");
    setFeedbackMessage("");
    try {
      if (!deleteTarget.return_date) {
        await syncBookStock(deleteTarget.book_id, 1, deleteTarget.book?.code);
      }
      await deletePeminjaman(deleteTarget.id);
      setDeleteTarget(null);
      setFeedbackMessage("Peminjaman berhasil dihapus.");
      await fetchBorrowings(currentPage);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menghapus peminjaman."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const filteredBorrowings = borrowings.filter((item) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    const memberLabel = item.member ? `${item.member.code} ${item.member.name}` : String(item.member_id);
    const bookLabel = item.book ? `${item.book.code} ${item.book.title}` : String(item.book_id);
    return (
      String(item.id).includes(keyword) ||
      memberLabel.toLowerCase().includes(keyword) ||
      bookLabel.toLowerCase().includes(keyword) ||
      item.borrow_date.toLowerCase().includes(keyword) ||
      item.due_date.toLowerCase().includes(keyword) ||
      (item.return_date ?? "").toLowerCase().includes(keyword)
    );
  });

  const memberOptions = members.map((member) => ({
    id: member.id,
    label: `${member.code} - ${member.name}`,
  }));

  const activeBorrowings = borrowings
    .filter((item) => !item.return_date && item.member_id === selectedReturnMemberId)
    .map((item) => ({
      id: item.id,
      label: `#${item.id} - ${item.member?.name ?? item.member_id} - ${
        item.book?.title ?? item.book_id
      } (${item.borrow_date})`,
      returnDate: returnDates[item.id] ?? "",
    }));

  function closeFormModal() {
    setIsFormModalOpen(false);
    setIsMemberDropdownOpen(false);
    setIsBookDropdownOpen(false);
  }

  function toggleMemberDropdown() {
    setIsMemberDropdownOpen((prev) => !prev);
    setIsBookDropdownOpen(false);
  }

  function toggleBookDropdown() {
    setIsBookDropdownOpen((prev) => !prev);
    setIsMemberDropdownOpen(false);
  }

  function selectMember(member: MemberDto) {
    setFormData((prev) => ({ ...prev, member_id: member.id }));
    setSelectedMemberLabel(getMemberLabel(member));
    setIsMemberDropdownOpen(false);
  }

  function selectBook(book: BukuDto) {
    if (modalMode === "create") {
      setSelectedBooks((prev) => {
        if (prev.some((item) => item.id === book.id)) return prev;
        if (prev.length >= 2) return prev;
        return [...prev, book];
      });
      setSelectedBookLabel("");
      setBookSearch("");
    } else {
      setFormData((prev) => ({ ...prev, book_id: book.id }));
      setSelectedBookLabel(getBookLabel(book));
    }
    setIsBookDropdownOpen(false);
  }

  function removeSelectedBook(bookId: number) {
    setSelectedBooks((prev) => prev.filter((item) => item.id !== bookId));
  }

  function getActiveBorrowCount(memberId: number, excludeBorrowingId?: number): number {
    return borrowings.filter((item) => {
      if (item.member_id !== memberId) return false;
      if (excludeBorrowingId && item.id === excludeBorrowingId) return false;
      return !item.return_date;
    }).length;
  }

  function parseDateOnly(value: string): Date {
    return new Date(`${value}T00:00:00`);
  }

  function formatDateLocal(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function diffInDays(startDate: Date, endDate: Date): number {
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay);
  }

  function getBorrowingCooldownInfo(memberId: number, borrowDateValue?: string): {
    isBlocked: boolean;
    blockedUntil?: string;
  } {
    const completed = borrowings
      .filter((item) => item.member_id === memberId && Boolean(item.return_date))
      .sort((a, b) => {
        const dateA = parseDateOnly(a.due_date).getTime();
        const dateB = parseDateOnly(b.due_date).getTime();
        return dateB - dateA;
      });

    const latest = completed[0];
    if (!latest || !latest.return_date) return { isBlocked: false };

    const dueDate = parseDateOnly(latest.due_date);
    const returnDate = parseDateOnly(latest.return_date);
    const lateDays = diffInDays(dueDate, returnDate);

    if (lateDays <= 7) return { isBlocked: false };

    const blockedUntil = new Date(returnDate);
    blockedUntil.setDate(blockedUntil.getDate() + 3);
    const blockedUntilStr = formatDateLocal(blockedUntil);
    const today = formatDateLocal(new Date());
    const borrowDate = parseDateOnly(borrowDateValue || today);

    return {
      isBlocked: borrowDate <= blockedUntil,
      blockedUntil: blockedUntilStr,
    };
  }

  const penaltyInfo = formData.member_id
    ? getBorrowingCooldownInfo(formData.member_id, formData.borrow_date)
    : { isBlocked: false as const };

  return (
    <AppShell>
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Tabel Peminjaman</h3>
          <div className="flex items-center gap-2">
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search peminjaman..."
              type="text"
              value={search}
            />
            <button
              className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
              onClick={openQuickReturnModal}
              type="button"
            >
              Pengembalian
            </button>
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
                <th className="px-4 py-3 font-semibold">Member</th>
                <th className="px-4 py-3 font-semibold">Buku</th>
                <th className="px-4 py-3 font-semibold">Tanggal Pinjam</th>
                <th className="px-4 py-3 font-semibold">Jatuh Tempo</th>
                <th className="px-4 py-3 font-semibold">Tanggal Kembali</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {errorMessage ? (
                <tr>
                  <td className="px-4 py-4 text-rose-600" colSpan={7}>
                    {errorMessage}
                  </td>
                </tr>
              ) : null}
              {isLoading ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={7}>
                    Memuat data peminjaman...
                  </td>
                </tr>
              ) : null}
              {!errorMessage && !isLoading && borrowings.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={7}>
                    Data peminjaman belum tersedia.
                  </td>
                </tr>
              ) : null}
              {filteredBorrowings.map((borrowing) => (
                <tr className="text-slate-700" key={borrowing.id}>
                  <td className="px-4 py-3">{borrowing.id}</td>
                  <td className="px-4 py-3">
                    {borrowing.member
                      ? borrowing.member.name
                      : borrowing.member_id}
                  </td>
                  <td className="px-4 py-3">
                    {borrowing.book
                      ? borrowing.book.title
                      : borrowing.book_id}
                  </td>
                  <td className="px-4 py-3">{borrowing.borrow_date}</td>
                  <td className="px-4 py-3">{borrowing.due_date}</td>
                  <td className="px-4 py-3">{borrowing.return_date ?? "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">

                      <button
                        className="rounded-md bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600"
                        onClick={() => openEditModal(borrowing)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700"
                        onClick={() => setDeleteTarget(borrowing)}
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

      <PeminjamanFormModal
        bookSearch={bookSearch}
        books={books}
        formData={formData}
        getBookLabel={getBookLabel}
        getMemberLabel={getMemberLabel}
        isBookDropdownOpen={isBookDropdownOpen}
        isMemberDropdownOpen={isMemberDropdownOpen}
        isOpen={isFormModalOpen}
        isSubmitting={isSubmitting}
        memberSearch={memberSearch}
        members={members}
        mode={modalMode}
        onBookSearchChange={setBookSearch}
        onClose={closeFormModal}
        onFormChange={setFormData}
        onMemberSearchChange={setMemberSearch}
        onSelectBook={selectBook}
        onSelectMember={selectMember}
        onSubmit={handleSubmit}
        onToggleBookDropdown={toggleBookDropdown}
        onToggleMemberDropdown={toggleMemberDropdown}
        selectedBooks={selectedBooks}
        selectedBookLabel={selectedBookLabel}
        selectedMemberLabel={selectedMemberLabel}
        onRemoveSelectedBook={removeSelectedBook}
        isPenaltyBlocked={penaltyInfo.isBlocked}
        penaltyMessage={
          penaltyInfo.isBlocked
            ? `Member ini sedang penalti sampai ${penaltyInfo.blockedUntil}.`
            : ""
        }
      />
      <ReturnPeminjamanModal
        activeBorrowings={activeBorrowings}
        isOpen={isReturnModalOpen}
        memberOptions={memberOptions}
        onChangeReturnDate={(id, value) =>
          setReturnDates((prev) => ({
            ...prev,
            [id]: value,
          }))
        }
        onClose={() => {
          setIsReturnModalOpen(false);
        }}
        onConfirm={(id) => void handleReturnBook(id)}
        onSelectMemberId={setSelectedReturnMemberId}
        selectedMemberId={selectedReturnMemberId}
        submittingBorrowingId={submittingReturnBorrowingId}
      />
      <DeletePeminjamanModal
        id={deleteTarget?.id ?? null}
        isDeleting={isDeleting}
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </AppShell>
  );
}
