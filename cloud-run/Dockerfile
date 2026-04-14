FROM python:3.10-slim

WORKDIR /app

# Copy dependencies
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Run the web service on container startup
# Workers can be adjusted based on needs
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
