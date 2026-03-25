import { AccountDAODatabase } from './infra/dao/AccountDAO';
import { AccountAssetDAODatabase } from './infra/dao/AccountAssetDAO';
// import AccountService from './application/service/AccountService';
import Registry from './infra/di/Registry';
import { ExpressAdapter } from './infra/http/HttpServer';
import { PgPromiseAdapter } from './infra/database/DatabaseConnection';
import AccountController from './infra/controller/AccountController';
import Signup from './application/usecase/Signup';
import GetAccount from './application/usecase/GetAccount';
import { AccountRepositoryDatabase } from './infra/repository/AccountRepository';
import ExecuteOrder from './application/usecase/ExecuteOrder';
import { MediatorMemory } from './infra/mediator/Mediator';

// Entrypoint
async function main() {
	const httpServer = new ExpressAdapter();
	Registry.getInstance().provide('databaseConnection', new PgPromiseAdapter());
	Registry.getInstance().provide('accountDAO', new AccountDAODatabase());
	Registry.getInstance().provide(
		'accountAssetDAO',
		new AccountAssetDAODatabase(),
	);
	Registry.getInstance().provide(
		'accountRepository',
		new AccountRepositoryDatabase(),
	);
	// Registry.getInstance().provide('accountService', new AccountService());
	Registry.getInstance().provide('httpServer', httpServer);
	Registry.getInstance().provide('signup', new Signup());
	Registry.getInstance().provide('getAccount', new GetAccount());
	const executeOrder = new ExecuteOrder();
	const mediator = new MediatorMemory();
	Registry.getInstance().provide('mediator', mediator);
	mediator.register('orderPlaced', async (event: any) => {
		await executeOrder.execute(event.marketId);
	});
	new AccountController();
	httpServer.listen(3000);
}

main();
