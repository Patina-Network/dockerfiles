FROM postgres:16-alpine

RUN apk add py3-pip python3
RUN apk add gcc musl-dev python3-dev libffi-dev openssl-dev cargo make
RUN python3 -m venv /opt/az
ENV PATH="/opt/az/bin:$PATH"
RUN pip install --upgrade pip
RUN pip install azure-cli

RUN az --version
