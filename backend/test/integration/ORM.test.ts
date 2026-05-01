import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import Registry from '../../src/infra/di/Registry';
import { test, expect } from '@jest/globals';
import ORM from '../../src/infra/orm/ORM';
import { AccountModel } from '../../src/infra/orm/AccountModel';

test('Deve persistir uma conta', async () => {
	const connection = new PgPromiseAdapter();
	Registry.getInstance().provide('databaseConnection', connection);
	const orm = new ORM();
	const accountId = crypto.randomUUID();
	const accountModel = new AccountModel(
		accountId,
		'John Doe',
		'john.doe@gmail.com',
		'11111111111',
		'asqQwe123',
	);
	await orm.save(accountModel);
	const savedAccountModel = await orm.get(
		AccountModel,
		'account_id',
		accountId,
	);
	expect(savedAccountModel.name).toBe(accountModel.name);
	expect(savedAccountModel.email).toBe(accountModel.email);
	expect(savedAccountModel.document).toBe(accountModel.document);
	expect(savedAccountModel.password).toBe(accountModel.password);
	await connection.close();
});
