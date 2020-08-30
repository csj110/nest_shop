import { Injectable, BadRequestException } from '@nestjs/common';
import { Redis } from '../common/redis.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(private redis: Redis, private jwtService: JwtService) {
	}

	async genCaptcha(phone: string): Promise<any> {
		if (!phone || phone.length != 11) throw new BadRequestException("bad phone or code")
		const key = `au:lg:${phone}`
		const code = Math.random().toFixed(4).slice(2)
		await this.redis.set(key, code, 5 * 60)
	}

	async loginByCode(phone: string, code: string): Promise<string> {
		if (!phone || phone.length != 11 || !code || code.length != 4) {
			throw new BadRequestException("bad phone or code")
		}
		const key = `au:lg:${phone}`
		if (code != await this.redis.get(key)) throw new BadRequestException("wrong code or expired code")
		this.redis.remove(key)
		return this.jwtService.sign({ phone })
	}
}
