import crypto from 'crypto';
import { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import Registry from '../../src/infra/di/Registry';
import { AccountDAODatabase } from '../../src/infra/dao/AccountDAO';
import {
	AccountRepositoryDatabase,
	AccountRepositoryORM,
} from './../../src/infra/repository/AccountRepository';
import Account from '../../src/domain/Account';
import { test, expect } from '@jest/globals';
import ORM from '../../src/infra/orm/ORM';

test('Deve persistir uma conta', async () => {
	const connection = new PgPromiseAdapter();
	Registry.getInstance().provide('databaseConnection', connection);
	Registry.getInstance().provide('orm', new ORM());
	// Registry.getInstance().provide('accountDAO', new AccountDAODatabase());
	// const accountRepository = new AccountRepositoryDatabase();
	const accountRepository = new AccountRepositoryORM();
	// const accountDAO = new AccountDAODatabase();
	// const account = {
	// 	// accountId: crypto.randomUUID(),
	// 	name: 'John Doe',
	// 	email: 'john.doe@email.com',
	// 	document: '07830021066',
	// 	password: 'mnbVCX1234',
	// };
	const account = Account.create(
		'John Doe',
		'john.email@email.com',
		'07830021066',
		'asdQWD12',
	);
	account.deposit('USD', 100000);
	account.deposit('BTC', 100);
	// await accountDAO.save(account);
	await accountRepository.save(account);
	// const savedAccount = await accountDAO.getById(account.accountId);
	const savedAccount = await accountRepository.getById(account.accountId);
	console.log('savedAccount', savedAccount);
	expect(savedAccount.accountId).toBe(account.accountId);
	expect(savedAccount.getName()).toBe(account.getName());
	expect(savedAccount.getEmail()).toBe(account.getEmail());
	expect(savedAccount.getDocument()).toBe(account.getDocument());
	expect(savedAccount.getPassword()).toBe(account.getPassword());
	expect(savedAccount.balances[0].quantity).toBe(100000);
	expect(savedAccount.balances[1].quantity).toBe(100);
	await connection.close();
});
