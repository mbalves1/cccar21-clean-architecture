import GetAccount from '../../application/usecase/GetAccount';
import HttpServer from '../http/HttpServer';
import { inject } from '../di/Registry';
import Signup from '../../application/usecase/Signup';
import Deposit from '../../application/usecase/Deposit';

// Interface Adapter
export default class AccountController {
	@inject('httpServer')
	httpServer!: HttpServer;
	@inject('signup')
	signup!: Signup;
	@inject('getAccount')
	getAccount!: GetAccount;
	@inject('deposit')
	deposit!: Deposit;

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
				const output = await this.getAccount.execute(params.accountId);
				return output;
			},
		);

		this.httpServer.route(
			'post',
			'/deposit',
			async (params: any, body: any) => {
				const output = await this.deposit.execute(body);
				return output;
			},
		);
	}
}
