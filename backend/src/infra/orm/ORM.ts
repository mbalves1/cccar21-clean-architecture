export default class ORM {
	async save(model: Model) {
		console.log('Model', model);
	}

	async get(model: Model, field: string, value: string): Promise<any> {
		return {};
	}
}

class Model {
	schema!: string;
	table!: string;
	column!: { column: string; property: string };
}

export class AccountModel extends Model {
	accountId: string;
	name: string;
	email: string;
	document: string;
	password: string;

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
