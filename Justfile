e file *args:
  just install-pre-scripts && sops --encrypt --in-place {{ file }} {{ args }}

d file *args:
  just install-pre-scripts && sops --decrypt --in-place {{ file }} {{ args }}

build-pg-az:
  just install-pre-scripts && docker build --platform linux/amd64 -t Patina-Network/pg-az -f src/pg-az/Dockerfile .

install-pre-scripts:
  just install-pre-commit && just install-pre-push

install-pre-commit:
  cp pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

install-pre-push:
  cp pre-commit .git/hooks/pre-push && chmod +x .git/hooks/pre-push
