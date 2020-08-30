import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {

	}

	@Post("captcha/login")
	async genCaptcha(@Body("phone") phone: string) {
		this.authService.genCaptcha(phone)
	}

	@Post("login/code")
	async loginByCode(@Body("phone") phone: string, @Body("code") code: string) {
		const token = await this.authService.loginByCode(phone, code)
		return token
	}
}
