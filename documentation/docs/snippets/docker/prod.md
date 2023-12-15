```bash
docker compose -f ./compose.prod.yaml up -d 
```

This command will make a production build and launch applications:

- Provider: <http://localhost:3000>
- Client: <http://localhost:3001>
- API: <http://localhost:4000>

:::tip
Be sure to use HTTPS on the server, otherwise video calls will not work for you.

To configure HTTPS you can use docker images [httpd](https://hub.docker.com/_/httpd), [nginx](https://hub.docker.com/_/nginx), [traefik](https://hub.docker.com/_/traefik) or any other.
:::
