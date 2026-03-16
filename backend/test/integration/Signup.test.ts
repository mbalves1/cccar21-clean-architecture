import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import GetAccount from '../../src/application/usecase/GetAccount';
import Signup from '../../src/application/usecase/Signup';
import { AccountAssetDAODatabase } from '../../src/infra/dao/AccountAssetDAO';
import {
	AccountDAODatabase,
	AccountDAOMemory,
} from '../../src/infra/dao/AccountDAO';
import DatabaseConnection, {
	PgPromiseAdapter,
} from '../../src/infra/database/DatabaseConnection';
import Registry from '../../src/infra/di/Registry';
import sinon from 'sinon';

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
	connection = new PgPromiseAdapter();
	Registry.getInstance().provide('databaseConnection', connection);
	const accountDAO = new AccountDAODatabase();
	Registry.getInstance().provide('accountDAO', accountDAO);
	Registry.getInstance().provide(
		'accountAssetDAO',
		new AccountAssetDAODatabase(),
	);
	Registry.getInstance().provide(
		'accountRepository',
		new AccountRepositoryDatabase(),
	);
	signup = new Signup();
	getAccount = new GetAccount();
});

test('Deve criar uma conta', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const outputSignup = await signup.execute(input);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
});

test('Não deve criar uma conta com nome invalido', async () => {
	const input = {
		name: 'John',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};
	await expect(() => signup.execute(input)).rejects.toThrow(
		new Error('Invalid name'),
	);
});

test('Deve criar uma conta com stub', async () => {
	const saveStub = sinon.stub(AccountDAODatabase.prototype, 'save').resolves();
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const getByIdStub = sinon
		.stub(AccountDAODatabase.prototype, 'getById')
		.resolves(input);

	const outputSignup = await signup.execute(input);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
	saveStub.restore();
	getByIdStub.restore();
});

test('Deve criar uma conta com spy', async () => {
	const saveSpy = sinon.spy(AccountDAODatabase.prototype, 'save');
	const getByIdSpy = sinon.spy(AccountDAODatabase.prototype, 'getById');
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const outputSignup = await signup.execute(input);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
	expect(saveSpy.calledOnce).toBe(true);
	expect(getByIdSpy.calledWith(outputSignup.accountId)).toBe(true);
	saveSpy.restore();
	getByIdSpy.restore();
});

test('Deve criar uma conta com mock', async () => {
	const accountDAOMock = sinon.mock(AccountDAODatabase.prototype);
	accountDAOMock.expects('save').once().resolves();
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};
	accountDAOMock.expects('getById').once().resolves(input);
	const outputSignup = await signup.execute(input);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
	accountDAOMock.verify();
	accountDAOMock.restore();
});

test('Deve criar uma conta com fake', async () => {
	const accountDAO = new AccountDAOMemory();
	Registry.getInstance().provide('accountDAO', accountDAO);
	signup = new Signup();
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const outputSignup = await signup.execute(input);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.document).toBe(input.document);
	expect(outputGetAccount.password).toBe(input.password);
});

afterEach(async () => {
	await connection.close();
});
