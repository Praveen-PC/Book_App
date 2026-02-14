"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Page = () => {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [isBookmark, setIsBookmark] = useState(false);

  

  const router = useRouter();

  const fetchAllBooks = async () => {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setBooks(data);
  };

  const fetchUserBookmarks = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select(
        `
        book_id,
        books:book_id (*)
      `,
      )
      .eq("user_id", userData.user.id);

    console.log("bookmarks with book details", data);

    if (!error) {

      const bookmarkedBooks = data
        .map((item) => item.books)
        .filter((book) => book !== null);
      const bookIds = data.map((item) => item.book_id);

      setBookmarkedBooks(bookmarkedBooks);
      setBookmarkedIds(bookIds);
    }
  };

  useEffect(() => {
    fetchAllBooks();
    fetchUserBookmarks();
  }, []);

  const handleAddNewBook = async () => {
    if (!title || !imageUrl) return;
    const { error } = await supabase
      .from("books")
      .insert([{ title, image_url: imageUrl, price: "200", quantity: "5" }]);
    if (!error) {
      setTitle("");
      setImageUrl("");
      fetchAllBooks();
      toast.success("Book Added successfully ");
    }
  };

  const toggleBookmark = async (bookId) => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user.id;

    if (bookmarkedIds.includes(bookId)) {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("book_id", bookId)
        .eq("user_id", userId);

      if (!error) {
        setBookmarkedIds((prev) => prev.filter((id) => id !== bookId));
        setBookmarkedBooks((prev) => prev.filter((book) => book.id !== bookId));
        toast.warning("Bookmark removed");
      }

      return;
    }

    const { error } = await supabase
      .from("bookmarks")
      .insert([{ book_id: bookId, user_id: userId }]);

    if (!error) {
      const bookDetails = books.find((book) => book.id === bookId);

      setBookmarkedIds((prev) => [...prev, bookId]);
      if (bookDetails) {
        setBookmarkedBooks((prev) => [...prev, bookDetails]);
      }
      toast.success("Bookmarked successfully");
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDeleteBook = async (bookId) => {
    const { error } = await supabase.from("books").delete().eq("id", bookId);

    if (error) {
      console.log(error.message);
      return;
    }

    fetchAllBooks();
    toast.success("Book Deleted successfully ");
  };

  const handleOpenBookmark = () => {
    setIsBookmark(true);
  };

  const handleCloseBookmarked = () => {
    setIsBookmark(false);
  };

  // rendering.................

  return (
    <div style={{ background: "#f4f7fb", minHeight: "100vh" }}>
      <nav
        className="navbar px-4 py-3 shadow-sm"
        style={{
          background: "linear-gradient(90deg,#4e54c8,#8f94fb)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="container-fluid gap-3 d-flex align-items-center justify-content-between">
          <h4 className="text-white fw-bold m-0 d-flex align-items-center gap-2">
            <i className="fa-solid fa-book"></i>
            Smart Bookmark
          </h4>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="position-relative">
              <i
                className="fa-solid fa-magnifying-glass position-absolute"
                style={{
                  top: "50%",
                  left: "12px",
                  transform: "translateY(-50%)",
                  color: "#6c757d",
                }}
              ></i>

              <input
                className="form-control ps-5"
                style={{
                  width: 230,
                  borderRadius: 50,
                  border: "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={handleOpenBookmark}
              className="btn btn-light rounded-pill  fw-semibold"
            >
              <i className="fa-solid fa-bookmark text-warning"></i>
              <span className="ms-2 d-none d-md-inline">Bookmarks</span>
            </button>

            <button
              onClick={logout}
              className="btn btn-danger rounded-pill  fw-semibold"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span className="ms-2 d-none d-md-inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {isBookmark ? (
        <div className="container py-4">
          <div
            className="p-4"
            style={{
              background: "rgba(255,255,255,0.65)",
              borderRadius: "18px",
              border: "1px solid rgba(78,84,200,0.25)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 8px 18px rgba(78,84,200,0.15)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center gap-3">
                <button
                  onClick={handleCloseBookmarked}
                  className="btn btn-light shadow-sm"
                  style={{
                    height: "36px",
                    width: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>

                <h5 className="fw-bold m-0" style={{ color: "#4e54c8" }}>
                  <i className="fa-solid fa-bookmark text-warning me-2"></i>
                  Bookmarked Books
                </h5>
              </div>

              <span
                className="badge"
                style={{
                  background: "linear-gradient(90deg,#4e54c8,#8f94fb)",
                  fontSize: "13px",
                  padding: "6px 12px",
                }}
              >
                {bookmarkedBooks.length} Saved
              </span>
            </div>

            <hr style={{ opacity: 0.15 }} />

            {bookmarkedBooks.length > 0 ? (
              <div className="row mt-3">
                {bookmarkedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="col-lg-3 col-md-4 col-sm-6 mb-4"
                  >
                    <div
                      className="card border-0 shadow-sm h-100"
                      style={{
                        borderRadius: 20,
                        transition: "0.3s",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          borderRadius: "20px 20px 0 0",
                        }}
                      >
                        <img
                          src={book.image_url}
                          className="card-img-top"
                          style={{
                            height: 220,
                            objectFit: "cover",
                            transition: "0.4s",
                          }}
                          alt={book.title}
                        />
                      </div>

                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="fw-bold">{book.title}</h6>
                            <p className="text-muted mb-3">
                              Quantity: {book.quantity}
                            </p>
                          </div>
                          <div>
                            <button
                              onClick={() => toggleBookmark(book.id)}
                              className="btn btn-warning d-flex justify-content-center"
                              style={{
                                height: "28px",
                                width: "28px",
                                fontSize: "14px",
                                borderRadius: "50%",
                              }}
                            >
                              <i className="fa-solid fa-bookmark"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted py-5">
                <i className="fa-regular fa-bookmark me-2"></i>
                No bookmarks yet
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="container py-4">
          <div
            className="p-4 mb-4"
            style={{
              background: "rgba(255,255,255,0.65)",
              borderRadius: "18px",
              border: "1px solid rgba(78,84,200,0.25)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 8px 18px rgba(78,84,200,0.15)",
            }}
          >
            <h5 className="mb-4 fw-bold" style={{ color: "#4e54c8" }}>
              <i className="fa-solid fa-circle-plus me-2"></i>
              Add New Book
            </h5>

            <div className="row g-3 align-items-end">
              <div className="col-md-5">
                <label className="form-label small text-muted">
                  Book Title
                </label>
                <input
                  className="form-control custom-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book name"
                />
              </div>

              <div className="col-md-5">
                <label className="form-label small text-muted">Image URL</label>
                <input
                  className="form-control custom-input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image link"
                />
              </div>

              <div className="col-md-2 d-grid">
                <button
                  style={{
                    background: "linear-gradient(90deg,#4e54c8,#8f94fb)",
                    backdropFilter: "blur(8px)",
                  }}
                  onClick={handleAddNewBook}
                  className="btn text-white fw-semibold add-btn"
                >
                  <i className="fa-solid fa-plus me-2"></i>
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            {filteredBooks.map((book) => (
              <div key={book.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{
                    borderRadius: 20,
                    transition: "0.3s",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      overflow: "hidden",
                      borderRadius: "20px 20px 0 0",
                    }}
                  >
                    <img
                      src={book.image_url}
                      className="card-img-top"
                      style={{
                        height: 220,
                        objectFit: "cover",
                        transition: "0.4s",
                      }}
                      alt={book.title}
                    />
                  </div>

                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="fw-bold">{book.title}</h6>
                        <p className="text-muted mb-3">
                          Quantity: {book.quantity}
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className="btn btn-danger d-flex justify-content-center"
                          style={{
                            height: "28px",
                            width: "28px",
                            fontSize: "14px",
                            borderRadius: "50%",
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleBookmark(book.id)}
                      className={`btn w-100 ${
                        bookmarkedIds.includes(book.id)
                          ? "btn-secondary"
                          : "btn-warning"
                      }`}
                    >
                      {bookmarkedIds.includes(book.id) ? (
                        <>
                          <i className="fa-solid fa-bookmark"></i> Bookmarked
                        </>
                      ) : (
                        <>
                          <i className="fa-regular fa-bookmark"></i> Add to
                          Bookmark
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <p className="text-center text-muted mt-5">No books found</p>
          )}
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={1200}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default Page;
