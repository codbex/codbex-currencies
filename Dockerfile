# Docker descriptor for codbex-currencies
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:latest

COPY codbex-currencies target/dirigible/repository/root/registry/public/codbex-currencies

ENV DIRIGIBLE_HOME_URL=/codbex-currencies/gen/index.html