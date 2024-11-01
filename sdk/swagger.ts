export const homepage = (assetsRoot: string) => /* html */ `<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Swagger UI</title>
    <link rel="stylesheet" type="text/css" href="${assetsRoot}/swagger-ui.css" />
    <link rel="stylesheet" type="text/css" href="${assetsRoot}/index.css" />
    <link rel="icon" type="image/png" href="${assetsRoot}/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="${assetsRoot}/favicon-16x16.png" sizes="16x16" />
    <style>
      /* Hide the top black bar */
      .swagger-ui .topbar {
        display: none;
      }
  </style>
  </head>

  <body>
    <div id="swagger-ui"></div>
    <script src="${assetsRoot}/swagger-ui-bundle.js" charset="UTF-8"> </script>
    <script src="${assetsRoot}/swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
    <script src="${assetsRoot}/swagger-initializer.js" charset="UTF-8"> </script>
    <script>
    window.onload = () => {
      const ui = SwaggerUIBundle({
        url: "/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });

      window.ui = ui;
    };
  </script>
  </body>
</html>
`
