
import { w3cwebsocket as WebSocket } from 'websocket';


enum EChatRoomsRequest {
    GETROOMS = 'get_rooms',
    CREATEROOM = 'create_room',
    JOINROOM = 'join_room',
    SENDMESSAGE = 'send_message',
    ENTERROOM = 'enter_room',
}

export interface IRoom {
    id: string;
    title: string;
    users: IRoomUser[];
}

export interface IRoomUser {
    id: string;
    userName: string;
};

enum EChatRoomsEvents {
    ROOMSLISTUPDATE = 'rooms_list_update',
    USERSLISTUPDATE = 'users_list_update',
};

export class ChatRoomsClient {
    client: WebSocket | null = null;
    connectionAwait: Promise<void>;
    constructor() {
        this.client = new WebSocket('ws://localhost:3002');
        this.client.binaryType = 'arraybuffer';
        this.connectionAwait = new Promise((resolve) => {
            if (!this.client)
                return;
            this.client.onopen = () => {
                console.log('ChatRoomsClient connected');
                resolve();
            }
        });
    }
    destroy() {
        if (this.client)
            this.client.close();
    }
    async initRooms(setRooms: (rooms: IRoom[]) => void) {
        if (!this.client)
            return;
        this.client.onmessage = (message) => {
            const data = JSON.parse(message.data as string);
            switch (data.event) {
                case EChatRoomsEvents.ROOMSLISTUPDATE:
                    const { rooms } = data;
                    setRooms(rooms);
                    break;
            }
        };
        await this.connectionAwait;
        const message = JSON.stringify({ request: EChatRoomsRequest.GETROOMS });
        this.client.send(message);
    }
    async initRoom(roomId: string, userId: string, userName: string, setRoom: (room: IRoom) => void) {
        if (!this.client)
            return;
        this.client.onmessage = (message) => {
            const data = JSON.parse(message.data as string);
            switch (data.event) {
                case EChatRoomsEvents.USERSLISTUPDATE:
                    const { id, title, users } = data;
                    setRoom({ id, title, users });
                    break;
            }
        };
        await this.connectionAwait;
        const request = {
            request: EChatRoomsRequest.JOINROOM,
            id: roomId,
            userId,
            userName
        }
        this.client.send(JSON.stringify(request));
    }
    getRooms() {
        if (!this.client)
            return;
        this.client.send(JSON.stringify({ request: EChatRoomsRequest.GETROOMS }));
    }
    createRoom(title: string) {
        if (!this.client)
            return;
        this.client.send(JSON.stringify({ request: EChatRoomsRequest.CREATEROOM, title }));
    }
}