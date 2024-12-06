export interface UserModel {
    id: number,
    email: string,
    password?: string,
    firstname: string,
    lastname: string,
    gender: string,
    picture?: string,
    role: string,
    enabled: boolean,
}