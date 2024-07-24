import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class LobbyService {
  private rooms: Record<string, string[]> = {};

  createRoom(): string {
    const roomId = uuidV4();
    this.rooms[roomId] = [];
    return roomId;
  }

  addPeer(roomId: string, peerId: string) {
    if (this.rooms[roomId]) {
      this.rooms[roomId].push(peerId);
    } else {
      throw new Error('Room does not exist');
    }
    // if (this.rooms[roomId]) {
    //   if (!this.rooms[roomId].includes(peerId)) {
    //     this.rooms[roomId].push(peerId);
    //   }
    // }
  }

  removePeer(roomId: string, peerId: string) {
    if (this.rooms[roomId]) {
      this.rooms[roomId] = this.rooms[roomId].filter((id) => id !== peerId);
      if (this.rooms[roomId].length === 0) {
        delete this.rooms[roomId];
      }
    } else {
      throw new Error('Room does not exist');
    }
  }

  getPeers(roomId: string): string[] {
    return this.rooms[roomId] || [];
  }

  getPeersWithRoom() {
    const roomsWithParticipants = [];
    const rooms = Object.keys(this.rooms);

    for (const roomId of rooms) {
      const participants = this.getPeers(roomId);
      roomsWithParticipants.push({ roomId, participants });
    }
    return roomsWithParticipants;
  }
}
