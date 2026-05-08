import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import styles from "./StoryDetail.module.css";

const StoryDetail = () => {
  const { id } = useParams();
  const { user, isBookmarked, updateBookmarks } = useAuth();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarking, setBookmarking] = useState(false);
  const [localBookmarked, setLocalBookmarked] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const { data } = await api.get(`/api/stories/${id}`);
        setStory(data.story);
      } catch (err) {
        setError(err.response?.status === 404 ? "Story not found." : "Failed to load story.");
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  const bookmarked = localBookmarked !== null ? localBookmarked : (story ? isBookmarked(story._id) : false);

  const handleBookmark = async () => {
    if (!user || bookmarking) return;
    setBookmarking(true);
    try {
      const { data } = await api.post(`/api/stories/${story._id}/bookmark`);
      setLocalBookmarked(data.bookmarked);
      updateBookmarks(data.bookmarks);
    } catch (err) {
      console.error(err);
    } finally {
      setBookmarking(false);
    }
  };

  if (loading) {
    return (
      <main className={styles.main}>
        <div className="container">
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <div className="container">
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => navigate(-1)} className={styles.backBtn}>← Go Back</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className="container">
        <Link to="/" className={styles.backLink}>← Back to Stories</Link>

        <article className={styles.article}>
          <div className={styles.rankBadge}>#{story.rank}</div>

          <h1 className={styles.title}>{story.title}</h1>

          <div className={styles.meta}>
            <span className={styles.points}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {story.points} points
            </span>

            {story.author && story.author !== "unknown" && (
              <span className={styles.metaChip}>by <strong>{story.author}</strong></span>
            )}

            {story.postedAt && (
              <span className={styles.metaChip}>{story.postedAt}</span>
            )}

            {story.commentsCount > 0 && (
              <span className={styles.metaChip}>{story.commentsCount} comments</span>
            )}
          </div>

          <div className={styles.actions}>
            {story.url && (
              <a href={story.url} target="_blank" rel="noopener noreferrer" className={styles.visitBtn}>
                Visit Article
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            )}

            {story.hnId && (
              <a
                href={`https://news.ycombinator.com/item?id=${story.hnId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.hnBtn}
              >
                View on HN ▲
              </a>
            )}

            {user && (
              <button
                className={`${styles.bookmarkBtn} ${bookmarked ? styles.bookmarked : ""}`}
                onClick={handleBookmark}
                disabled={bookmarking}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            )}
          </div>

          {story.url && (
            <div className={styles.urlBox}>
              <span className={styles.urlLabel}>Source URL</span>
              <a href={story.url} target="_blank" rel="noopener noreferrer" className={styles.urlText}>
                {story.url}
              </a>
            </div>
          )}
        </article>
      </div>
    </main>
  );
};

export default StoryDetail;
