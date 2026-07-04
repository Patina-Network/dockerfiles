# thin layer over `gerritcodereview/gerrit` that will install plugins as well.

ARG GERRIT_VERSION=3.13.4
FROM gerritcodereview/gerrit:${GERRIT_VERSION}

# make sq happy
USER gerrit

# add plugins here

ADD --chown=gerrit:gerrit \
  https://github.com/davido/gerrit-oauth-provider/releases/download/v3.13.4/gerrit-oauth-provider.jar \
  /var/gerrit/plugins/gerrit-oauth-provider.jar

