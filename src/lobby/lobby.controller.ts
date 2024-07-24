import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @UseGuards(JwtAuthGuard)
  @Get('peers')
  getParticipantsByRoomId() {
    return this.lobbyService.getPeersWithRoom();
  }

  @Get('room/:roomId/peers')
  getParticipants(@Param('roomId') roomId: string): string[] {
    return this.lobbyService.getPeers(roomId);
  }
}
