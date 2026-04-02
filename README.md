# Snippet Manager
App for saving and organising code snippets. 


## Tech Stack

**Backend** — Django 5, DRF, SimpleJWT, SQLite  
**Frontend** — React, Vite, TanStack Query


## Project Structure
```
snippet-manager/
├── api/     
└── snippet-frontend/    
```


## Backend Setup
```bash
cd api
python -m venv venv
source venv/bin/activate.fish
pip install -r requirements.txt

cp .env.example .env          

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  
python manage.py runserver
```

API runs at `http://localhost:8000`  
Swagger docs at `http://localhost:8000/api/docs/`


## Frontend Setup
```bash
cd snippet-frontend
pnpm install
cp .env.example .env           
pnpm run dev
```

App runs at `http://localhost:5173`


## Environment Variables

**Backend `.env`**
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7
```

**Frontend `.env`**
```
VITE_API_URL=http://localhost:8000/api/v1
```



## API Endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/v1/auth/register/` | No |
| POST | `/api/v1/auth/login/` | No |
| POST | `/api/v1/auth/token/refresh/` | No |
| GET / PATCH | `/api/v1/auth/me/` | Yes |
| GET / POST | `/api/v1/snippets/` | Yes |
| GET / PATCH / DELETE | `/api/v1/snippets/<id>/` | Yes |
| GET | `/api/v1/snippets/public/` | No |
| GET / POST | `/api/v1/snippets/tags/` | Yes |
| GET / PATCH / DELETE | `/api/v1/snippets/tags/<id>/` | Yes |

Query params on `GET /snippets/`: `?search=` `?language=` `?is_public=` `?tags=` `?ordering=`

-
## Running Tests
```bash
cd api
python manage.py test apps
```
