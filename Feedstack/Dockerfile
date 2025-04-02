FROM python:3.12.6 AS backend

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000

FROM node:18 AS frontend

WORKDIR /client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client ./
EXPOSE 3000

FROM python:3.12.6 AS final_backend

WORKDIR /app

COPY --from=backend /app /app
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY --from=frontend /client /client

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

ENV PYTHONUNBUFFERED=1
EXPOSE 8000 3000
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000 & cd /client && npm start"]