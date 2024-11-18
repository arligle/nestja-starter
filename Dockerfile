ARG NODE_VERSION=18
# base
FROM lw96/node:${NODE_VERSION}-alpine AS base

# docker build --build-arg REGISTRY=xxx
ARG REGISTRY=https://registry.npmmirror.com

ENV PNPM_REGISTRY=${REGISTRY}
ENV PNPM_STORE=/usr/local/share/pnpm-store

WORKDIR /app
RUN chown node:node /app

# prod
FROM base AS prod-deps
COPY --chown=node:node package*.json .
COPY --chown=node:node pnpm-lock.yaml .
RUN pnpm config set registry ${PNPM_REGISTRY}
RUN --mount=type=cache,id=pnpm,target=${PNPM_STORE} pnpm install --prod --frozen-lockfile --reporter silent

# build
FROM base AS build
COPY --chown=node:node . .
RUN pnpm config set registry ${PNPM_REGISTRY}
RUN --mount=type=cache,id=pnpm,target=${PNPM_STORE} pnpm install --frozen-lockfile --reporter silent
RUN npm run build:clients
RUN npm run build:prod

# image
FROM node:${NODE_VERSION}-alpine 

USER node

WORKDIR /app

COPY --chown=node:node --from=prod-deps /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/prisma /app/prisma
COPY --chown=node:node --from=build /app/dist /app/dist

CMD ["node", "dist/main.js"]