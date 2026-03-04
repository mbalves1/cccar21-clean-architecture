import AccountDAO from './AccountDAO';
import AccountAssetDAO from './AccountAssetDAO';
import { inject } from './Registry';
import AccountRepository from './AccountRepository';

export default class Withdraw {
	@inject('accountRepository')
	accountRepository!: AccountRepository;

	async execute(input: Input): Promise<void> {
		const account = await this.accountRepository.getById(input.accountId);
		account.withdraw(input.assetId, input.quantity);
		await this.accountRepository.update(account);
	}
}

type Input = {
	accountId: string;
	assetId: string;
	quantity: number;
};
