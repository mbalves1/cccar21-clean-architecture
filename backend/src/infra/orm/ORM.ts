export default class ORM {
	async save(model: Model) {
		console.log('Model', model.schema, model.table, model.columns);
		const columns = model.columns.map((column: any) => column.column).join(',');
		const params = model.columns.map((_, index) => `$${index + 1}`).join(',');
		const query = `insert into ${model.schema}.${model.table} (${columns}) values (${params})`;
	}

	async get(model: Model, field: string, value: string): Promise<any> {
		return {};
	}
}

class Model {
	schema!: string;
	table!: string;
	columns!: { column: string; property: string }[];
}

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

function model(schema: string, table: string) {
	return function (target: any) {
		target.prototype.schema = schema;
		target.prototype.table = table;
	};
}

function column(column: string) {
	return function (target: any, propertyKey: string) {
		target.columns = target.columns || [];
		target.columns.push({ column, property: propertyKey });
	};
}
