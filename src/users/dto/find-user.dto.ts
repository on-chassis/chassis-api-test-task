interface FindUserByEmailDto {
    username: string;
}

interface FindUserByIdDto {
    id: string;
}

export type FindUserDto = FindUserByEmailDto | FindUserByIdDto;