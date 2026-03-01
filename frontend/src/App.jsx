import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export default function App() {
  const [userId, setUserId] = useState(1);
  const [predictUserId, setPredictUserId] = useState(1);
  const [predictMovieId, setPredictMovieId] = useState(50);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [predictLoading, setPredictLoading] = useState(false);
  const [predictError, setPredictError] = useState("");
  const [predictedRating, setPredictedRating] = useState(null);

  useEffect(() => {
    const bootMessage = document.getElementById("boot-message");
    if (bootMessage) {
      bootMessage.style.display = "none";
    }
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/recommend/${userId}`);
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.detail || "Failed to fetch recommendations");
      }
      const payload = await response.json();
      setMovies(payload.recommendations || []);
    } catch (err) {
      setMovies([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrediction = async () => {
    setPredictLoading(true);
    setPredictError("");
    setPredictedRating(null);
    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: predictUserId,
          movie_id: predictMovieId,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.detail || "Failed to predict rating");
      }

      setPredictedRating(payload.predicted_rating);
    } catch (err) {
      setPredictError(err.message);
    } finally {
      setPredictLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Movie Recommendation System</h1>
      <h2>Top 5 Recommendations</h2>
      <div className="controls">
        <input
          type="number"
          min="1"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          placeholder="Enter MovieLens User ID"
        />
        <button onClick={fetchRecommendations} disabled={loading}>
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </div>
      {error ? <p className="error">{error}</p> : null}
      <section className="grid">
        {movies.map((movie) => (
          <MovieCard key={movie.movie_id} movie={movie} />
        ))}
      </section>

      <h2>Predict Rating</h2>
      <div className="controls">
        <input
          type="number"
          min="1"
          value={predictUserId}
          onChange={(e) => setPredictUserId(Number(e.target.value))}
          placeholder="User ID"
        />
        <input
          type="number"
          min="1"
          value={predictMovieId}
          onChange={(e) => setPredictMovieId(Number(e.target.value))}
          placeholder="Movie ID"
        />
        <button onClick={fetchPrediction} disabled={predictLoading}>
          {predictLoading ? "Loading..." : "Predict"}
        </button>
      </div>
      {predictError ? <p className="error">{predictError}</p> : null}
      {predictedRating !== null ? (
        <p>Predicted Rating: {Number(predictedRating).toFixed(2)}</p>
      ) : null}
    </main>
  );
}
