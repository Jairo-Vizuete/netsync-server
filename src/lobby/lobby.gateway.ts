import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { LobbyService } from './lobby.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST'],
  },
})
export class LobbyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('Lobby');
  private peerRoomMap: Map<string, { roomId: string; peerId: string }> =
    new Map();

  @WebSocketServer()
  server: Server;

  constructor(private readonly lobbyService: LobbyService) {}

  afterInit(server: Server) {
    this.logger.verbose(`${server._connectTimeout} Server Init`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const peerData = this.peerRoomMap.get(client.id);
    if (peerData) {
      const { roomId, peerId } = peerData;
      this.logger.warn(`User left the room: ${peerId}`);
      this.lobbyService.removePeer(roomId, peerId);
      const updatePeers = this.lobbyService.getPeers(roomId);
      this.server.to(roomId).emit('peer-disconnected', { peerId });
      this.server.to(roomId).emit('get-peers', { roomId, peers: updatePeers });
      this.peerRoomMap.delete(client.id);
    }
    this.logger.warn(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('create-room')
  handleCreateRoom(@ConnectedSocket() client: Socket): void {
    const roomId = this.lobbyService.createRoom();
    this.logger.debug('Room Id: ' + roomId);
    client.join(roomId);
    this.server.to(roomId).emit('room-created', { roomId });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; peerId: string },
  ): void {
    const { roomId, peerId } = payload;
    try {
      this.lobbyService.addPeer(roomId, peerId);
      client.join(roomId);
      this.server.to(roomId).emit('peer-joined', { peerId, roomId });

      const peers = this.lobbyService.getPeers(roomId);
      this.server.to(roomId).emit('get-peers', { roomId, peers });

      this.logger.verbose(`Peer ${peerId} joined room: ${roomId}`);

      this.peerRoomMap.set(client.id, { roomId, peerId });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}
