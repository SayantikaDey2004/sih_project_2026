FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements files first for better caching
COPY Backend/requirements.txt ./backend_reqs.txt
COPY Ml_models/requirements.txt ./ml_reqs.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r backend_reqs.txt
RUN pip install --no-cache-dir -r ml_reqs.txt

# Copy the rest of the application
COPY . .

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Default port
EXPOSE 8000

# Start the application using a shell to expand the $PORT variable provided by Render
CMD ["sh", "-c", "uvicorn Backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
