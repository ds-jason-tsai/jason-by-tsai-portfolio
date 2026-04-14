FROM python:3.10-slim

WORKDIR /app

# Copy dependencies from the cloud-run subdirectory
COPY cloud-run/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code from the cloud-run subdirectory
COPY cloud-run/ .

# Run the web service on container startup
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
