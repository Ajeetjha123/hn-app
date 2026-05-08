import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StoryDetail from "./pages/StoryDetail";
import Bookmarks from "./pages/Bookmarks";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/stories/:id" element={<StoryDetail />} />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />
           <Route
          path="*"
          element={
            <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 40 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 800, color: "var(--text-muted)" }}>404</h2>
              <p style={{ color: "var(--text-muted)" }}>Page not found.</p>
              <a href="/" style={{ color: "var(--accent-orange)", fontWeight: 600, textDecoration: "none" }}>← Back to Home</a>
            </main>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
