/// <reference types="node" />
import { IncomingMessage, Server as HTTPServer, ServerResponse } from 'http';
import { WebSocketServer } from 'ws';
import { Hocuspocus } from './Hocuspocus';
export declare class Server {
    httpServer: HTTPServer;
    webSocketServer: WebSocketServer;
    hocuspocus: Hocuspocus;
    constructor(hocuspocus: Hocuspocus);
    setupWebsocketConnection: () => void;
    setupHttpUpgrade: () => void;
    requestHandler: (request: IncomingMessage, response: ServerResponse) => Promise<void>;
}
