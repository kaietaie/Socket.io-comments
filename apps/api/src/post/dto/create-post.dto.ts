export class CreatePostDTO {
    readonly user: string
    readonly email: string
    readonly homePage: string
    text: string
    readonly captcha: string
}