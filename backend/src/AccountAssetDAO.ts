import DatabaseConnection from './DatabaseConnection';
import { inject } from './Registry';

export default interface AccountAssetDAO {
	save(account: any): Promise<void>;
	update(account: any): Promise<void>;
	deleteByAccountId(accountId: string): Promise<any>;
	getByAccountId(accountId: string): Promise<any>;
}

export class AccountAssetDAODatabase implements AccountAssetDAO {
	@inject('databaseConnection')
	connection!: DatabaseConnection;

	async save(accountAsset: any): Promise<void> {
		await this.connection.query(
			'insert into cccar.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)',
			[accountAsset.accountId, accountAsset.assetId, accountAsset.quantity],
		);
	}

	async update(accountAsset: any): Promise<void> {
		await this.connection.query(
			'update cccar.account_asset set quantity = $1 where account_id = $2 and asset_id = $3',
			[accountAsset.quantity, accountAsset.accountId, accountAsset.assetId],
		);
	}

	async getByAccountId(accountId: string): Promise<any> {
		const accountAssets = await this.connection.query(
			'select * from cccar.account_asset where account_id = $1',
			[accountId],
		);

		return accountAssets;
	}

	async deleteByAccountId(accountId: string): Promise<any> {
		await this.connection.query(
			'delete from cccar.account_asset where account_id = $1',
			[accountId],
		);
	}
}
