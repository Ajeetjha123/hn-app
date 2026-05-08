import { useState, useEffect } from "react";
import StoryCard from "../components/StoryCard";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import styles from "./Home.module.css";

const Home = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState(null);
  const [scrapeMsg, setScrapeMsg] = useState(null);

  const fetchStories = async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/api/stories?page=${p}&limit=10`);
      setStories(data.stories);
      setPagination(data.pagination);
    } catch (err) {
      setError("Failed to load stories. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories(page);
  }, [page]);

  const handleScrape = async () => {
    setScraping(true);
    setScrapeMsg(null);
    try {
      const { data } = await api.post("/api/scrape");
      setScrapeMsg(`✅ Scraped ${data.count} stories successfully.`);
      fetchStories(1);
      setPage(1);
    } catch {
      setScrapeMsg("❌ Scrape failed. Please try again.");
    } finally {
      setScraping(false);
      setTimeout(() => setScrapeMsg(null), 4000);
    }
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>
              Top Stories
              <span className={styles.headingAccent}>▲</span>
            </h1>
            <p className={styles.subheading}>
              Hacker News — sorted by points
            </p>
          </div>

          <button
            className={styles.scrapeBtn}
            onClick={handleScrape}
            disabled={scraping}
          >
            {scraping ? (
              <>
                <span className={styles.spinner} />
                Scraping...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Refresh Stories
              </>
            )}
          </button>
        </div>

        {scrapeMsg && (
          <div className={styles.scrapeMsg}>{scrapeMsg}</div>
        )}

        {!user && (
          <div className={styles.loginPrompt}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>
              <a href="/login" className={styles.loginLink}>Sign in</a> to bookmark stories and access them later.
            </span>
          </div>
        )}

        {loading && (
          <div className={styles.loadingGrid}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className={styles.error}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div className={styles.empty}>
            <p>No stories yet.</p>
            <button className={styles.scrapeBtn} onClick={handleScrape}>
              Scrape Now
            </button>
          </div>
        )}

        {!loading && !error && stories.length > 0 && (
          <>
            <div className={styles.storyList}>
              {stories.map((story, i) => (
                <StoryCard key={story._id} story={story} index={i} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                >
                  ← Prev
                </button>
                <span className={styles.pageInfo}>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
