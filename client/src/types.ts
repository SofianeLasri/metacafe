export type EmojiDataByGroup = {
    [key: string]: {
        "emoji": string;
        "skin_tone_support": boolean;
        "name": string;
        "slug": string;
        "unicode_version": number;
        "emoji_version": number;
    }
}

export type UserPublicProfile = {
    id: number;
    name: string;
    profilePicture?: number | null;
    status: string;
};

export type Attachment = {
    id: number;
    name: string;
    url: string;
}

export type ActivityType = "friendRequest" | "sendMessage";

export type Activity = {
    id: number;
    userId: number;
    targetUserId: number;
    type: ActivityType;
    isNew: boolean;
}

export type Sender = "me" | "friend";

export type CenterOfInterest = {
    id: number;
    name: string;
};

export interface Message {
    id: number;
    senderUserId: number;
    receiverUserId: number;
    text: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SearchZoneResult {
    name: string;
    value: string;
    attachment?: number;
}