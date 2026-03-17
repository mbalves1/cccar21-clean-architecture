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
let placeOrder: PlaceOrder;
let getOrder: GetOrder;

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
	placeOrder = new PlaceOrder();
	getOrder = new GetOrder();
});

test('Deve criar uma ordem de compra', async () => {
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
		quantity: 100000,
	};
	await deposit.execute(inputDeposit);

	const inputPlaceOrder = {
		accountId: outputSignup.accountId,
		marketId: 'BTC/USD',
		side: 'buy',
		quantity: 1,
		price: 85000,
	};
	const outputPlaceOrder = await placeOrder.execute(inputPlaceOrder);
	expect(outputPlaceOrder.orderId).toBeDefined();
	const outputGetOrder = await getOrder.execute(outputPlaceOrder.orderId);

	expect(outputGetOrder.marketId).toBe(inputPlaceOrder.marketId);
	expect(outputGetOrder.side).toBe(inputPlaceOrder.side);
	expect(outputGetOrder.quantity).toBe(inputPlaceOrder.quantity);
	expect(outputGetOrder.price).toBe(inputPlaceOrder.price);
});

afterEach(async () => {
	await connection.close();
});
