import AccountDAO from '../../infra/dao/AccountDAO';
import AccountAssetDAO from '../../infra/dao/AccountAssetDAO';
import { inject } from '../../infra/di/Registry';
import AccountRepository from '../../infra/repository/AccountRepository';

export default class GetAccount {
	@inject('accountRepository')
	accountRepository!: AccountRepository;

	async execute(accountId: string): Promise<Output> {
		const account = await this.accountRepository.getById(accountId);
		return {
			accountId: account.accountId,
			name: account.getName(),
			email: account.email,
			document: account.document,
			password: account.password,
			balances: account.balances,
		};
	}
}

type Output = {
	accountId: string;
	name: string;
	email: string;
	document: string;
	password: string;
	balances: { assetId: string; quantity: number }[];
};
