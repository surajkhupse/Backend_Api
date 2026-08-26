FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
# npm ci fails when the Windows lockfile is missing Linux optional deps (emnapi).
RUN npm install
RUN npm install --no-save @rolldown/binding-linux-x64-gnu

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
