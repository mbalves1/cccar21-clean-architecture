import crypto from 'crypto';
import { PgPromiseAdapter } from './../../src/infra/database/DatabaseConnection';
import Registry from '../../src/infra/di/Registry';
import { AccountDAODatabase } from './../../src/infra/dao/AccountDAO';

test('Deve persistir uma conta', async () => {
	const connection = new PgPromiseAdapter();
	Registry.getInstance().provide('databaseConnection', connection);
	const accountDAO = new AccountDAODatabase();
	const account = {
		accountId: crypto.randomUUID(),
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	await accountDAO.save(account);
	const savedAccount = await accountDAO.getById(account.accountId);
	expect(savedAccount.account_id).toBe(account.accountId);
	expect(savedAccount.name).toBe(account.name);
	expect(savedAccount.email).toBe(account.email);
	expect(savedAccount.document).toBe(account.document);
	expect(savedAccount.password).toBe(account.password);
	await connection.close();
});
