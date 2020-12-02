FROM node:12 as builder

# install and cache app dependencies
COPY package*.json ./
RUN npm install && mkdir /EPlast-Client && mv ./node_modules ./EPlast-Client

WORKDIR /EPlast-Client

COPY . .

ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm run build


# ------------------------------------------------------
# Production Build
# ------------------------------------------------------
FROM nginx:alpine
COPY --from=builder /EPlast-Client/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]

