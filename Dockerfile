FROM oven/bun:1.4.2-alpine AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY tsconfig.json ./
COPY src ./src
RUN bun build src/index.ts --target=bun --minify --outfile=server.js

FROM oven/bun:1.4.2-distroless
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build --chown=65532:65532 /app/server.js ./server.js

USER 65532:65532
CMD ["server.js"]
