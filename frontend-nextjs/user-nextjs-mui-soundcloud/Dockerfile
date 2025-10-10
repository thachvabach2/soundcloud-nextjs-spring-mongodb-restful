FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /devtaycode-nextjs
# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

########################################################################################################

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /devtaycode-nextjs
COPY --from=deps /devtaycode-nextjs/node_modules ./node_modules
COPY . .
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# get value from docker-compose
ARG NEXT_PUBLIC_BACKEND_URL

# gán ARG vào ENV để Next.js dùng được khi build
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# If using npm comment out above and use below instead
RUN npm run build


########################################################################################################

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /devtaycode-nextjs

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /devtaycode-nextjs/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /devtaycode-nextjs/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /devtaycode-nextjs/.next/static ./.next/static

USER nextjs

EXPOSE 3001

ENV PORT 3001

CMD ["node", "server.js"]

# docker build -t devtaycode-next-soundcloud .
# docker run -d --name devtaycode -p 3000:3000 devtaycode-next-soundcloud