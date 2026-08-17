FROM python:3.13-slim

WORKDIR /app/apps/api

COPY apps/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/api/ .
COPY packages/ /app/packages/

EXPOSE 8000

# Écoute sur "::" (IPv6 dual-stack) : requis pour le réseau privé Railway
CMD ["sh", "-c", "uvicorn main:app --host :: --port ${PORT:-8000}"]
