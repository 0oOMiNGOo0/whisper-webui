

FROM python:3.9-buster
WORKDIR /app
COPY ./backend .
RUN pip install -r requirements.txt
EXPOSE 5050
CMD ["python", "/app/whisper_import.py"]

