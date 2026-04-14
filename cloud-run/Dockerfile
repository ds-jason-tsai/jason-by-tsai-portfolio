FROM python:3.10-slim

WORKDIR /app

# Copy dependencies
COPY cloud-run/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY cloud-run/ .

# Run the web service on container startup
# Workers can be adjusted based on needs
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
