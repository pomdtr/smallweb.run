export default {
  "openapi": "3.0.3",
  "info": {
    "title": "Smallweb API",
    "version": "0"
  },
  "paths": {
    "/v0/apps": {
      "get": {
        "operationId": "getApps",
        "tags": [
          "apps"
        ],
        "responses": {
          "200": {
            "description": "List of apps",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/App"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/v0/apps/{app}": {
      "get": {
        "tags": [
          "apps"
        ],
        "operationId": "getApp",
        "parameters": [
          {
            "name": "app",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Get app",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/App"
                }
              }
            }
          }
        }
      }
    },
    "/v0/run/{app}": {
      "post": {
        "operationId": "runApp",
        "tags": [
          "apps"
        ],
        "parameters": [
          {
            "name": "app",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "args"
                ],
                "properties": {
                  "args": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Run app cli",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommandOutput"
                }
              },
              "text/plain": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/v0/logs/cron": {
      "get": {
        "tags": [
          "logs"
        ],
        "operationId": "getCronLogs",
        "parameters": [
          {
            "name": "app",
            "in": "query",
            "schema": {
              "type": "string"
            },
            "description": "Filter logs by app"
          }
        ],
        "responses": {
          "200": {
            "description": "Stream of cron logs",
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          }
        }
      }
    },
    "/v0/logs/http": {
      "get": {
        "operationId": "getHttpLogs",
        "tags": [
          "logs"
        ],
        "parameters": [
          {
            "name": "host",
            "in": "query",
            "schema": {
              "type": "string"
            },
            "description": "Filter logs by host"
          }
        ],
        "responses": {
          "200": {
            "description": "Stream logs",
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          }
        }
      }
    },
    "/v0/logs/console": {
      "get": {
        "operationId": "getConsoleLogs",
        "tags": [
          "logs"
        ],
        "parameters": [
          {
            "name": "app",
            "in": "query",
            "schema": {
              "type": "string"
            },
            "description": "Filter logs by app"
          }
        ],
        "responses": {
          "200": {
            "description": "Stream logs",
            "content": {
              "application/octet-stream": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "App": {
        "type": "object",
        "required": [
          "name",
          "url"
        ],
        "properties": {
          "name": {
            "type": "string"
          },
          "url": {
            "type": "string"
          },
          "manifest": {
            "type": "object"
          }
        }
      },
      "CommandOutput": {
        "type": "object",
        "required": [
          "success",
          "code",
          "stdout",
          "stderr"
        ],
        "properties": {
          "success": {
            "type": "boolean"
          },
          "code": {
            "type": "integer"
          },
          "stdout": {
            "type": "string"
          },
          "stderr": {
            "type": "string"
          }
        }
      }
    }
  }
} as const;
