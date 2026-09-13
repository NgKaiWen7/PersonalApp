# Stage 1: Build the Go binary
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY go.mod go.sum* ./
RUN go mod download

# Copy source files and compile
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server ./main.go

# Stage 2: Minimal runtime image
FROM alpine:3.21

# Install CA certificates for HTTPS outbound requests and tzdata if needed
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy the binary from the build stage
COPY --from=builder /app/server .

# Create the data directory referenced in your volumes
RUN mkdir -p /data

EXPOSE 8000

CMD ["./server"]
