# Docker descriptor for codbex-currencies
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.12.0

COPY codbex-currencies target/dirigible/repository/root/registry/public/codbex-currencies

COPY codbex-currencies-data target/dirigible/repository/root/registry/public/codbex-currencies-data

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-currencies/gen/index.html
