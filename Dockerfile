FROM node:18.14.0

WORKDIR /usr/src/face-detection-api-grpc

COPY ./ ./

RUN npm install


CMD ["/bin/bash"]