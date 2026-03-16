import Withdraw from '../../src/application/usecase/Withdraw';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import Deposit from '../../src/application/usecase/Deposit';
import GetAccount from '../../src/application/usecase/GetAccount';
import Signup from '../../src/application/usecase/Signup';
import { AccountAssetDAODatabase } from '../../src/infra/dao/AccountAssetDAO';
import { AccountDAODatabase } from '../../src/infra/dao/AccountDAO';
import DatabaseConnection, {
	PgPromiseAdapter,
} from '../../src/infra/database/DatabaseConnection';
import Registry from '../../src/infra/di/Registry';

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;
let deposit: Deposit;
let withdraw: Withdraw;

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
	deposit = new Deposit();
	withdraw = new Withdraw();
});

test('Deve depositar em uma conta', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const outputSignup = await signup.execute(input);
	const inputDeposit = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 1000,
	};
	await deposit.execute(inputDeposit);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.balances[0].assetId).toBe('USD');
	expect(outputGetAccount.balances[0].quantity).toBe(1000);
});

test('Não deve depositar em uma conta que não existe', async () => {
	const input = {
		name: 'John Doe',
		email: 'john.doe@email.com',
		document: '07830021066',
		password: 'mnbVCX1234',
	};

	const outputSignup = await signup.execute(input);
	const inputDeposit = {
		accountId: crypto.randomUUID(),
		assetId: 'USD',
		quantity: 1000,
	};
	await expect(() => deposit.execute(inputDeposit)).rejects.toThrow(
		new Error('Account not found!'),
	);
});

afterEach(async () => {
	await connection.close();
});
