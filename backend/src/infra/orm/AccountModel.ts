import { column, Model, model } from './ORM';

@model('cccar', 'account')
export class AccountModel extends Model {
	@column('account_id')
	accountId!: string;
	@column('name')
	name!: string;
	@column('email')
	email!: string;
	@column('document')
	document!: string;
	@column('password')
	password!: string;

	constructor(
		accountId: string,
		name: string,
		email: string,
		document: string,
		password: string,
	) {
		super();
		this.accountId = accountId;
		this.name = name;
		this.email = email;
		this.document = document;
		this.password = password;
	}
}
