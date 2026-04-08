# Movie Recommendation System (Collaborative Filtering)

Production-style full-stack recommendation system built with Python, FastAPI, SQLite, and React.

## Project Type
- Localhost-only project
- No live hosting required
- Download/clone and run locally

## Portfolio Highlights
- End-to-end ML pipeline on real MovieLens data.
- Collaborative filtering via matrix factorization (`TruncatedSVD`).
- FastAPI backend with typed schemas and robust error handling.
- SQLite persistence for users, movies, and ratings.
- React frontend with recommendation and prediction workflows.
- Local development and optional Docker local run.

## Tech Stack
- **ML:** Python, pandas, NumPy, scikit-learn, SciPy
- **Backend:** FastAPI, SQLAlchemy, Pydantic
- **Database:** SQLite
- **Frontend:** React (Vite)
- **DevOps:** Docker, GitHub

## System Architecture
```text
MovieLens Ratings/Movies CSV
        |
        v
ML Training Pipeline (ml/src/train.py)
  - clean + preprocess
  - train/test split
  - SVD factorization
  - RMSE evaluation
  - save artifacts/cf_model.joblib
        |
        v
FastAPI Service (api/app)
  - /recommend/{user_id}
  - /predict
  - /health
  - serves frontend bundle
        |
        v
React UI + fallback HTML UI
```

## ML Workflow
1. Download MovieLens (`ml-latest-small`).
2. Clean/validate ratings and types.
3. Split into train/test.
4. Build sparse user-item matrix.
5. Center by user mean and train low-rank SVD.
6. Evaluate with RMSE on holdout set.
7. Persist model bundle for online inference.

Latest observed training metric on this setup: **RMSE ≈ 0.9275**.

## API Endpoints
- `GET /recommend/{user_id}` → top 5 recommended movies
- `POST /predict` → predicted rating for `{ "user_id": int, "movie_id": int }`
- `GET /health` → health check

Example request:
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "movie_id": 50}'
```

## Project Structure
```text
movie-recommender/
├── api/
│   ├── app/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── config.py
│   │   └── main.py
│   └── run.py
├── ml/
│   └── src/
│       └── train.py
├── frontend/
│   ├── src/
│   └── index.html
├── data/
├── artifacts/
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Local Setup

### 1) Clone or download
Option A (git clone):
```bash
git clone https://github.com/prestonhuss42-commits/movie-recommender-cf.git
cd movie-recommender-cf
```

Option B (GitHub ZIP):
1. Open the repository on GitHub.
2. Click "Code".
3. Click "Download ZIP".
4. Extract and open the folder.

### 2) Python environment
```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 3) Train model
```bash
python -m ml.src.train
```

### 4) Run backend
```bash
cd api
python run.py
```

### 5) Run frontend
```bash
cd frontend
npm install
npm run dev
```

### 6) Open locally
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## Environment Variables
Create `.env` from `.env.example`:

- `APP_NAME`
- `API_HOST`
- `API_PORT`
- `DATABASE_URL`
- `MODEL_PATH`
- `TOP_K`

## Docker (Local Only)
Run locally with Docker:

```bash
docker compose up --build
```

## Roadmap
- Add user authentication and personalized saved profiles.
- Add batch retraining + model versioning.
- Add A/B testing and online recommendation metrics.
- Add CI tests for API contract and model artifact integrity.

## License
MIT
