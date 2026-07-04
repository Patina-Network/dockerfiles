# thin layer over `gerritcodereview/gerrit` that will install plugins as well.

ARG GERRIT_VERSION=3.13.4
FROM gerritcodereview/gerrit:${GERRIT_VERSION}

# make sq happy
USER gerrit

# add plugins here

ADD --chown=gerrit:gerrit \
  https://gerrit-ci.gerritforge.com/job/plugin-github-gh-bazel-stable-3.13/lastSuccessfulBuild/artifact/bazel-bin/plugins/github/github-oauth.jar \
  /var/gerrit/lib/github-oauth.jar

ADD --chown=gerrit:gerrit \
  https://gerrit-ci.gerritforge.com/job/plugin-github-gh-bazel-stable-3.13/lastSuccessfulBuild/artifact/bazel-bin/plugins/github/github-plugin.jar \
  /var/gerrit/plugins/github.jar

