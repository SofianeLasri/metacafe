export type CreateUserDTO = {
    name: string;
    email: string;
    password: string;
    hasSeenIntro?: boolean;
}

export type UpdateUserDTO = Required<CreateUserDTO>;

export type FilterUsersDTO = {
    name?: string;
    isDeleted?: boolean;
    includeDeleted?: boolean;
}