# OpenTelemetry

Smallweb supports OpenTelemetry for monitoring and tracing. To activate it, just set the `OTEL_DENO` environment variable to `true` before starting the server.

```sh
OTEL_DENO=true smallweb up
```

By default, it will send traces, metrics and logs to `http://localhost:4317`. You can wire it to  self-hosted grafana instance with the following docker-command:

```sh
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti \
    -v "$PWD"/lgtm/grafana:/data/grafana \
    -v "$PWD"/lgtm/prometheus:/data/prometheus \
    -v "$PWD"/lgtm/loki:/data/loki \
    -e GF_PATHS_DATA=/data/grafana \
    docker.io/grafana/otel-lgtm:0.8.1
```

You can use a bunch of `OTEL_` prefixed env variables to configure opentelemetry. If you want to use grafana cloud (they have a generous free tier), you can follow [this guide](https://grafana.com/docs/grafana-cloud/send-data/otlp/send-data-otlp/#manual-opentelemetry-setup-for-advanced-users).

Checkout the [Deno Docs](https://docs.deno.com/runtime/fundamentals/open_telemetry) to learn more about opentelemetry support in deno.
