import AccountDAO from '../../infra/dao/AccountDAO';
import AccountAssetDAO from '../../infra/dao/AccountAssetDAO';
import { inject } from '../../infra/di/Registry';
import AccountRepository from '../../infra/repository/AccountRepository';

export default class GetAccount {
	@inject('accountRepository')
	accountRepository!: AccountRepository;

	async execute(accountId: string): Promise<Output> {
		const account = await this.accountRepository.getById(accountId);
		return account;
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
