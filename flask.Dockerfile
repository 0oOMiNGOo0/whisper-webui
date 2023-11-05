

FROM python:3.9-buster
COPY . /app
WORKDIR /app/backend
RUN pip install -r requirements.txt
EXPOSE 5050
CMD ["python", "/app/backend/whisper_import.py"]

