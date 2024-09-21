
// import { w3cwebsocket as WebSocket } from 'websocket';
import { v6 as uuidv6 } from 'uuid';


enum EChatRoomsRequest {
    GETROOMS = 'get_rooms',
    CREATEROOM = 'create_room',
    JOINROOM = 'join_room',
    LEAVEROOM = 'leave_room',
    SENDMESSAGE = 'send_message',
    MARKASREAD = 'mark_as_read',
}

export interface IRoom {
    id: string;
    title: string;
    users: IRoomUser[];
}

export interface IRoomUser {
    userId: string;
    userName: string;
};


enum EChatRoomsEvents {
    ROOMSLISTUPDATE = 'rooms_list_update',
    USERSLISTUPDATE = 'users_list_update',
    ROOMHISTORY = 'room_history',
    MESSAGESUPDATE = 'messages_update',
    NEWMESSAGE = 'new_message',
};

interface IRoomMessageReadTimestamp {
    [userId: string]: string;
}

export interface IRoomMessage {
    messageId: string;
    userId: string;
    message: string;
    timestamp: string;
    readTimestamp: IRoomMessageReadTimestamp;
}



export class ChatRoomsClient {
    client: WebSocket;
    connectionAwait: Promise<void>;
    roomId: string | null = null;
    userName: string | null = null;
    userId: string | null = null;
    messages: IRoomMessage[] = [];
    onMessageEventRoom: (message: MessageEvent) => void = () => { };
    onMessageEventRooms: (message: MessageEvent) => void = () => { };

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

    async initRooms(setRooms: (rooms: IRoom[]) => void) {
        if (!this.client)
            return;

        this.onMessageEventRooms = (message) => {
            const data = JSON.parse(message.data as string);
            switch (data.event) {
                case EChatRoomsEvents.ROOMSLISTUPDATE:
                    const { rooms } = data;
                    console.log('ROOMSLISTUPDATE', rooms);
                    setRooms(rooms);
                    break;
            }
        };
        this.client.addEventListener('message', this.onMessageEventRooms);

        
        await this.connectionAwait;
        const message = JSON.stringify({ request: EChatRoomsRequest.GETROOMS });
        this.client.send(message);
    }

    async destroyRooms() {
        if (!this.client)
            return;
        this.client.removeEventListener('message', this.onMessageEventRooms);
    }

    async leaveRoom() {
        if (!this.client)
            return;
        await this.connectionAwait;
        const message = JSON.stringify({
            request: EChatRoomsRequest.LEAVEROOM,
            roomId: this.roomId,
            userId: this.userId
        });
        this.client.send(message);
        this.client.removeEventListener('message', this.onMessageEventRoom);
        console.log('leaveRoom', this.roomId, this.userId);

    }

    async joinRoom(
        roomId: string,
        userId: string, userName: string,
        setRoom: (room: IRoom) => void,
        setMessages: (messages: IRoomMessage[]) => void,
    ) {
        console.log('joinRoom', roomId, userId, userName);
        this.roomId = roomId;
        this.userName = userName;
        this.userId = userId;

        if (!this.client)
            return;


        this.onMessageEventRoom = (message) => {
            const data = JSON.parse(message.data as string);

            const onMessagesUpdate = (messagesUpdate: IRoomMessage[]) => {
                for (const message of messagesUpdate) {
                    const findMessageIndex = this.messages.findIndex((m) => m.messageId === message.messageId);
                    if (findMessageIndex !== -1) {
                        this.messages[findMessageIndex] = message;
                    } else {
                        this.messages.push(message);
                    }
                }
                setMessages([...this.messages]);
            };

            const sendMessagesRead = (messages: IRoomMessage[]) => {
                const messagesId = messages.filter((message) => !message.readTimestamp[userId]).map((message) => message.messageId);
                if (messagesId.length === 0)
                    return;
                const request = {
                    request: EChatRoomsRequest.MARKASREAD,
                    roomId,
                    userId,
                    messagesId: messagesId
                }
                this.client.send(JSON.stringify(request));
            };
            switch (data.event) {
                case EChatRoomsEvents.USERSLISTUPDATE:
                    setRoom({
                        id: this.roomId || '',
                        title: data.title,
                        users: data.users
                    });
                    break;
                case EChatRoomsEvents.MESSAGESUPDATE:
                    sendMessagesRead(data.messages);
                    onMessagesUpdate(data.messages);
                    break;
                case EChatRoomsEvents.ROOMHISTORY:
                    sendMessagesRead(data.messages);
                    this.messages = data.messages;
                    setMessages(data.messages);
                    break;
                case EChatRoomsEvents.NEWMESSAGE:
                    sendMessagesRead([data.message]);
                    onMessagesUpdate([data.message]);
            }
        };
        
        this.client.addEventListener('message', this.onMessageEventRoom);

        await this.connectionAwait;
        const request = {
            request: EChatRoomsRequest.JOINROOM,
            roomId,
            userId,
            userName
        }
        this.client.send(JSON.stringify(request));
    }

    sendMessage(message: string) {
        if (!this.client)
            return;

        const messageId = uuidv6();
        const { roomId, userId } = this;
        const request = {
            request: EChatRoomsRequest.SENDMESSAGE,
            messageId,
            message,
            roomId,
            userId,
        };

        this.client.send(JSON.stringify(request));
    }

    createRoom(title: string) {
        if (!this.client)
            return;
        this.client.send(JSON.stringify({ request: EChatRoomsRequest.CREATEROOM, title }));
    }
}