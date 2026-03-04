import { AccountDAODatabase } from '../src/AccountDAO';
import Registry from '../src/Registry';
import { AccountAssetDAODatabase } from '../src/AccountAssetDAO';
import DatabaseConnection, {
	PgPromiseAdapter,
} from '../src/DatabaseConnection';
import Signup from '../src/Signup';
import GetAccount from '../src/GetAccount';
import Deposit from '../src/Deposit';
import Withdraw from '../src/Withdraw';
import { AccountRepositoryDatabase } from '../src/AccountRepository';

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

test('Deve sacar de uma conta', async () => {
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
	const inputWithDraw = {
		accountId: outputSignup.accountId,
		assetId: 'USD',
		quantity: 300,
	};
	await withdraw.execute(inputWithDraw);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	expect(outputGetAccount.balances[0].assetId).toBe('USD');
	expect(outputGetAccount.balances[0].quantity).toBe(700);
});

afterEach(async () => {
	await connection.close();
});
