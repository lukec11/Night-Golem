# ---------- Base ----------
FROM node:14-alpine AS base

# Set timezone to US Eastern
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


WORKDIR /app

# ---------- Builder ----------
# Creates:
# - node_modules: production dependencies (no dev dependencies)
# - build: A production build compiled with Babel
FROM base AS builder

COPY package*.json .babelrc ./

RUN npm install

COPY ./src ./src

RUN npm run build

RUN npm prune --production # Remove dev dependencies

# ---------- Release ----------
FROM base AS release

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

USER node


CMD ["node", "./build/app.js"]