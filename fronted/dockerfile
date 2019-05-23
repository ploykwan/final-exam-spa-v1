FROM node:10-alpine
WORKDIR /app
COPY build build
RUN yarn init -y
RUN yarn global add serve
CMD ["serve","build"]