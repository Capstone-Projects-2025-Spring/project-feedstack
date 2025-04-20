FROM python:3.12-slim as backend

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

FROM node:18 as frontend-builder
WORKDIR /client
COPY client/package.json client/package-lock.json ./
RUN npm ci --silent
COPY client .
RUN npm run build

FROM python:3.12-slim
WORKDIR /app

COPY --from=backend /app /app

COPY --from=frontend-builder /client/build /app/client_build

RUN pip install --no-cache-dir gunicorn

ENV PORT=8080
EXPOSE $PORT


CMD ["gunicorn", "feedstack_project.wsgi:application", "--bind", "0.0.0.0:$PORT"]