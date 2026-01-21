export interface CreateSessionInput {
  name: string;
  startAt: string;
  location: string;
  playerCount?: number | null;
  courtCount: number;
  roomCode: string;
  createdBy?: string | null;
  amountPerGame: number;
  courtNames: string[];
}

export interface ResponseSession {
  id: string;
  name: string;
  startAt: Date;
  location: string;
  playerCount: number;
  courtCount: number;
  roomCode: string;
  amountPerGame: number;
  isActive: boolean;
  isRandom: boolean;
  createdDate: Date;
  updatedDate: Date;
  createdBy: string;
  updatedBy: string;
}
