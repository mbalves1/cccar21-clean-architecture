import Account from '../../domain/Account';
import AccountAssetDAO from '../dao/AccountAssetDAO';
import AccountDAO from '../dao/AccountDAO';
import { inject } from '../di/Registry';
import { AccounAssetModel } from '../orm/AccountAssetModel';
import { AccountModel } from '../orm/AccountModel';
import ORM from '../orm/ORM';

export default interface AccountRepository {
	save(account: Account): Promise<void>;
	getById(accountId: string): Promise<Account>;
	update(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {
	@inject('accountDAO')
	accountDAO!: AccountDAO;
	@inject('accountAssetDAO')
	accountAssetDAO!: AccountAssetDAO;

	async save(account: Account): Promise<void> {
		return this.accountDAO.save(account);
	}

	async update(account: Account): Promise<void> {
		await this.accountDAO.update(account);
		await this.accountAssetDAO.deleteByAccountId(account.accountId);
		for (const balance of account.balances) {
			await this.accountAssetDAO.save({
				accountId: account.accountId,
				...balance,
			});
		}
	}

	async getById(accountId: string): Promise<Account> {
		const accountData = await this.accountDAO.getById(accountId);
		if (!accountData) throw new Error('Account not found!');
		const account = new Account(
			accountData.account_id,
			accountData.name,
			accountData.email,
			accountData.document,
			accountData.password,
		);
		const accountAssetsData =
			await this.accountAssetDAO.getByAccountId(accountId);
		for (const accountAssetData of accountAssetsData) {
			account.balances.push({
				assetId: accountAssetData.asset_id,
				quantity: parseFloat(accountAssetData.quantity),
			});
		}
		return account;
	}
}

export class AccountRepositoryORM implements AccountRepository {
	@inject('orm')
	orm!: ORM;

	async save(account: Account): Promise<void> {
		const accountModel = new AccountModel(
			account.accountId,
			account.getName(),
			account.getEmail(),
			account.getDocument(),
			account.getPassword(),
		);
		await this.orm.save(accountModel);
		for (const balance of account.balances) {
			const accountAssetModel = new AccounAssetModel(
				account.accountId,
				balance.assetId,
				balance.quantity.toString(),
			);
			await this.orm.save(accountAssetModel);
		}
	}

	async update(account: Account): Promise<void> {
		// await this.accountDAO.update(account);
		// await this.accountAssetDAO.deleteByAccountId(account.accountId);
		// for (const balance of account.balances) {
		// 	await this.accountAssetDAO.save({
		// 		accountId: account.accountId,
		// 		...balance,
		// 	});
		// }
	}

	async getById(accountId: string): Promise<Account> {
		const accountModel = await this.orm.get(
			AccountModel,
			'account_id',
			accountId,
		);
		if (!accountModel) throw new Error('Account not found!');
		console.log('....................', accountModel);
		const account = new Account(
			accountModel.accountId,
			accountModel.name,
			accountModel.email,
			accountModel.document,
			accountModel.password,
		);
		const accountAssetsModel = await this.orm.list(
			AccounAssetModel,
			'account_id',
			accountId,
		);
		for (const accountAssetModel of accountAssetsModel) {
			account.balances.push({
				assetId: accountAssetModel.asset_id,
				quantity: parseFloat(accountAssetModel.quantity),
			});
		}
		return account;
	}
}
