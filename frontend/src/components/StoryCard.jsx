import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import styles from "./StoryCard.module.css";

const getDomain = (url) => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return null;
  }
};

const BookmarkIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const StoryCard = ({ story, index }) => {
  const { user, isBookmarked, updateBookmarks } = useAuth();
  const [bookmarking, setBookmarking] = useState(false);
  const [localBookmarked, setLocalBookmarked] = useState(null);

  const bookmarked = localBookmarked !== null ? localBookmarked : isBookmarked(story._id);
  const domain = getDomain(story.url);

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user || bookmarking) return;

    setBookmarking(true);
    try {
      const { data } = await api.post(`/api/stories/${story._id}/bookmark`);
      setLocalBookmarked(data.bookmarked);
      updateBookmarks(data.bookmarks);
    } catch (err) {
      console.error("Bookmark error:", err);
    } finally {
      setBookmarking(false);
    }
  };

  return (
    <article className={styles.card} style={{ animationDelay: `${index * 60}ms` }}>
      <div className={styles.rank}>
        <span className={styles.rankNumber}>{story.rank || index + 1}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <Link to={`/stories/${story._id}`} className={styles.title}>
            {story.title}
          </Link>
          {story.url && domain && (
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLink}
              title={`Visit ${domain}`}
            >
              <ExternalIcon />
              <span>{domain}</span>
            </a>
          )}
        </div>

        <div className={styles.meta}>
          <span className={styles.points}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {story.points} pts
          </span>

          {story.author && story.author !== "unknown" && (
            <span className={styles.metaItem}>
              by <strong className={styles.author}>{story.author}</strong>
            </span>
          )}

          {story.postedAt && (
            <span className={styles.metaItem}>{story.postedAt}</span>
          )}

          {story.commentsCount > 0 && (
            <span className={styles.metaItem}>
              {story.commentsCount} comments
            </span>
          )}
        </div>
      </div>

      {user && (
        <button
          className={`${styles.bookmarkBtn} ${bookmarked ? styles.bookmarked : ""}`}
          onClick={handleBookmark}
          disabled={bookmarking}
          title={bookmarked ? "Remove bookmark" : "Bookmark story"}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark story"}
        >
          <BookmarkIcon filled={bookmarked} />
        </button>
      )}
    </article>
  );
};

export default StoryCard;
