import GetAccount from '../../application/usecase/GetAccount';
import HttpServer from '../http/HttpServer';
import { inject } from '../di/Registry';
import Signup from '../../application/usecase/Signup';

// Interface Adapter
export default class AccountController {
	@inject('httpServer')
	httpServer!: HttpServer;
	@inject('signup')
	signup!: Signup;
	@inject('getAccount')
	getAcoount!: GetAccount;

	constructor() {
		this.httpServer.route('post', '/signup', async (params: any, body: any) => {
			console.log('body', body);

			const output = await this.signup.execute(body);
			return output;
		});

		this.httpServer.route(
			'get',
			'/accounts/:accountId',
			async (params: any, body: any) => {
				const output = await this.getAcoount.execute(params.accountId);
				return output;
			},
		);
	}
}
