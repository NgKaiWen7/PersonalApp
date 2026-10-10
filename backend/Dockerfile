FROM postgres:18

RUN apt-get update \
    && apt-get install -y \
        build-essential \
        git \
        flex \
        bison \
        libreadline-dev \
        zlib1g-dev \
        postgresql-server-dev-18 \
    && rm -rf /var/lib/apt/lists/*

# pgvector
RUN git clone --branch v0.8.1 https://github.com/pgvector/pgvector.git /tmp/pgvector \
    && cd /tmp/pgvector \
    && make \
    && make install \
    && rm -rf /tmp/pgvector

# Apache AGE
RUN git clone --branch PG18 https://github.com/apache/age.git /tmp/age \
    && cd /tmp/age \
    && make \
    && make install \
    && rm -rf /tmp/age
