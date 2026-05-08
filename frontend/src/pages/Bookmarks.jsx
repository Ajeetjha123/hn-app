import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StoryCard from "../components/StoryCard";
import styles from "./Bookmarks.module.css";

const Bookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const { data } = await api.get("/api/auth/me");
        setBookmarks(data.user.bookmarks || []);
      } catch {
        setError("Failed to load bookmarks.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>
              My Bookmarks
              <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--accent-orange)" className={styles.headingIcon}>
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </h1>
            <p className={styles.subheading}>@{user?.username} — saved stories</p>
          </div>
        </div>

        {loading && (
          <div className={styles.loadingGrid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className={styles.error}>{error}</div>
        )}

        {!loading && !error && bookmarks.length === 0 && (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            <p>No bookmarks yet.</p>
            <Link to="/" className={styles.browseLink}>Browse stories →</Link>
          </div>
        )}

        {!loading && !error && bookmarks.length > 0 && (
          <div className={styles.storyList}>
            {bookmarks.map((story, i) => (
              <StoryCard key={story._id} story={story} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Bookmarks;
