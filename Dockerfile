FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ENV BASE_URL=https://www.saucedemo.com
ENV CI=true

CMD ["npx", "playwright", "test", "--reporter=list"]
