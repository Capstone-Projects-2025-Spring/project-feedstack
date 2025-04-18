FROM python:3.12.6 AS backend

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

FROM node:18 AS frontend

WORKDIR /client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client ./
RUN npm run build

FROM python:3.12.6 AS final_backend

WORKDIR /app

COPY --from=backend /app /app
RUN pip install --no-cache-dir -r requirements.txt
COPY --from=frontend /client/build /app/client_build

RUN python manage.py collectstatic --noinput
RUN python manage.py migrate

ENV PORT=8080
EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "feedstack_project.wsgi:application"]