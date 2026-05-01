import { column, Model, model } from './ORM';

@model('cccar', 'account_asset')
export class AccounAssetModel extends Model {
	@column('account_id')
	accountId!: string;
	@column('asset_id')
	asset_id!: string;
	@column('quantity')
	quantity!: string;

	constructor(accountId: string, asset_id: string, quantity: string) {
		super();
		this.accountId = accountId;
		this.asset_id = asset_id;
		this.quantity = quantity;
	}
}
