import { Hocuspocus } from "@hocuspocus/server";

const server = new Hocuspocus({
  port: 1234,
});

server.configure({
  async onListen(data) {
    console.log(`Listening for connections at port ${data.port}`);
    console.log(server.getDocumentsCount());
    console.log(server.getConnectionsCount());
  },

  async onLoadDocument(data) {
    console.log(
      `New document created. Total doc count is ${server.getDocumentsCount()}`
    );
  },

  async onDestroy(data) {
    console.log(
      `Destroying document. Total doc count is ${server.getDocumentsCount()}`
    );
  },

  async onConnect(data) {
    console.log(
      `New connection. Total connection count is ${server.getConnectionsCount()}`
    );
  },

  async onDisconnect(data) {
    console.log(
      `A connection closed. Total connection count is ${server.getConnectionsCount()}`
    );
  },
});

server.listen();
