export default {
    "info": {
        "title": "VS Code API",
        "version": "1.0.0"
    },
    "openapi": "3.1.0",
    "paths": {
        "/fs/stat": {
            "post": {
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "path": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "path"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "200 OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "type": {
                                            "anyOf": [
                                                {
                                                    "type": "number",
                                                    "const": 1
                                                },
                                                {
                                                    "type": "number",
                                                    "const": 2
                                                },
                                                {
                                                    "type": "number",
                                                    "const": 64
                                                }
                                            ]
                                        },
                                        "ctime": {
                                            "type": "number"
                                        },
                                        "mtime": {
                                            "type": "number"
                                        },
                                        "size": {
                                            "type": "number"
                                        }
                                    },
                                    "required": [
                                        "type",
                                        "ctime",
                                        "mtime",
                                        "size"
                                    ]
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "400 Bad Request",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "error": {
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "error"
                                    ]
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "404 Not Found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "error": {
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "error"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        "/fs/readDirectory": {
            "post": {
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "path": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "path"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "200 OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "name": {
                                                "type": "string"
                                            },
                                            "type": {
                                                "anyOf": [
                                                    {
                                                        "type": "number",
                                                        "const": 1
                                                    },
                                                    {
                                                        "type": "number",
                                                        "const": 2
                                                    },
                                                    {
                                                        "type": "number",
                                                        "const": 64
                                                    }
                                                ]
                                            }
                                        },
                                        "required": [
                                            "name",
                                            "type"
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "400 Bad Request",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "error": {
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "error"
                                    ]
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "404 Not Found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "error": {
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "error"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        "/fs/createDirectory": {
            "post": {
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "path": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "path"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "200 OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean"
                                        }
                                    },
                                    "required": [
                                        "success"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        "/fs/readFile": {
            "post": {
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "path": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "path"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "200 OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean"
                                        },
                                        "b64": {
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "success",
                                        "b64"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        "/fs/writeFile": {
            "post": {
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "path": {
                                        "type": "string"
                                    },
                                    "b64": {
                                        "type": "string"
                                    },
                                    "create": {
                                        "type": "boolean"
                                    },
                                    "overwrite": {
                                        "type": "boolean"
                                    }
                                },
                                "required": [
                                    "path",
                                    "b64",
                                    "create",
                                    "overwrite"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "200 OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean"
                                        }
                                    },
                                    "required": [
                                        "success"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        "/fs/copy": {
            "post": {
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "source": {
                                        "type": "string"
                                    },
                                    "destination": {
                                        "type": "string"
                                    },
                                    "overwrite": {
                                        "type": "boolean"
                                    }
                                },
                                "required": [
                                    "source",
                                    "destination",
                                    "overwrite"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "200 OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean"
                                        }
                                    },
                                    "required": [
                                        "success"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        "/fs/rename": {
            "post": {
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "oldPath": {
                                        "type": "string"
                                    },
                                    "newPath": {
                                        "type": "string"
                                    },
                                    "overwrite": {
                                        "type": "boolean"
                                    }
                                },
                                "required": [
                                    "oldPath",
                                    "newPath",
                                    "overwrite"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "200 OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean"
                                        }
                                    },
                                    "required": [
                                        "success"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        "/fs/delete": {
            "post": {
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "path": {
                                        "type": "string"
                                    },
                                    "recursive": {
                                        "type": "boolean"
                                    }
                                },
                                "required": [
                                    "path",
                                    "recursive"
                                ]
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "200 OK",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "success": {
                                            "type": "boolean"
                                        }
                                    },
                                    "required": [
                                        "success"
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        }
    }
} as const;