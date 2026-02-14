"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      const currentUser = data.session?.user ?? null;
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        router.push("/booklist");
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) router.push("/booklist");
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "100vh", background: "#f4f7fb" }}
      >
        <div
          className="spinner-border mb-3"
          role="status"
          style={{ color: "#4e54c8", width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary fs-5">
          <i className="fa-solid fa-book me-2"></i>
          Loading your books...
        </p>
      </div>
    );
  }

  if (!user)
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(145deg, #f3f4f6 0%, #ffffff 100%)",
        }}
      >
        <div className="container text-center px-4">
          <div className="mb-5">
            <div className="d-inline-block p-4 bg-white rounded-circle shadow-sm mb-4">
              <i
                className="fa-solid fa-book-open text-primary"
                style={{ fontSize: "3.5rem" }}
              ></i>
            </div>
            <h1 className="display-4 fw-bold mb-3" style={{ color: "#1f2937" }}>
              Welcome to <span style={{ color: "#4e54c8" }}>Book App</span>
            </h1>
            <p className="lead text-secondary mb-4">
              Your personal library, always with you
            </p>
          </div>

          <button
            onClick={loginWithGoogle}
            className="btn btn-lg px-5 py-3 d-inline-flex align-items-center gap-3"
            style={{
              background: "#4e54c8",
              color: "white",
              border: "none",
              borderRadius: "50px",
              boxShadow: "0 10px 20px rgba(78,84,200,0.3)",
              fontSize: "1.2rem",
            }}
          >
            <i className="fa-brands fa-google"></i>
            Continue with Google
          </button>
        </div>
      </div>
    );

  return null;
}
