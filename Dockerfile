FROM node:17
WORKDIR /app
# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin/kubectl

COPY emptyfile confi[g] /root/.kube/
COPY . .
RUN npm install

ENTRYPOINT [ "sh" ]
CMD [ "-c", "kubectl port-forward -n longhorn-system svc/longhorn-frontend 9191:80 & npm run start" ]