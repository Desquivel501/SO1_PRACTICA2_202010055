FROM golang:1.19-alpine

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY *.go ./
COPY *.sum ./

RUN go build -o /backend

CMD [ "/backend" ]