FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

RUN apt-get update \ 
    && apt-get install -y gcc musl-dev \
    && apt-get install -y libpq-dev \ 
    && rm -rf /var/lib/apt/lists/* /usr/share/doc /usr/share/man \
    && apt-get clean

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
