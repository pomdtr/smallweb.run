export type LogLevel = 'info' | 'error' | 'warn';

export type Headers = {
    [key: string]: string[];
};

export type TLS = {
    resumed: boolean;
    version: number;
    cipher_suite: number;
    proto: string;
    server_name: string;
};

export type Request = {
    remote_ip: string;
    remote_port: string;
    client_ip: string;
    proto: string;
    method: string;
    host: string;
    uri: string;
    headers: Headers;
    tls: TLS;
};

export type ResponseHeaders = {
    [key: string]: string[];
};

export type LogEntry = {
    level: LogLevel;
    ts: number;
    logger: string;
    msg: string;
    request: Request;
    bytes_read: number;
    user_id: string;
    duration: number;
    size: number;
    status: number;
    resp_headers: ResponseHeaders;
};
