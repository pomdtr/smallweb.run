FROM node:20-alpine
ARG VERSION=main
RUN apk add -u krb5-dev libx11-dev libxkbfile-dev libsecret-dev git build-base python3
RUN git clone --depth 1 https://github.com/microsoft/vscode.git -b ${VERSION}
WORKDIR /vscode

RUN npm install
RUN npm run gulp vscode-web-min

# For use with `docker run -v ./dist:/dist ...`
CMD cp -r /vscode-web/* /dist
