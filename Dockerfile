FROM node:20-bookworm

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Installs browsers matching whatever @playwright/test resolves to from
# package-lock.json, rather than pinning a separate image tag that can (and
# did) silently drift out of sync with the npm package version.
RUN npx playwright install --with-deps

ENV BASE_URL=https://www.saucedemo.com
ENV CI=true

CMD ["npx", "playwright", "test", "--reporter=list"]
