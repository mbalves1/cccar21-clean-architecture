import AccountDAO from './AccountDAO';
import AccountAssetDAO from './AccountAssetDAO';
import { inject } from './Registry';
import AccountRepository from './AccountRepository';

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
