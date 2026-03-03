import { validateCpf } from './validateCpf';
import { validatePassword } from './validatePassword';
import { validateEmail } from './validateEmail';
import { validateName } from './validateName';

export default class Account {
	balances: Balance[] = [];

	constructor(
		readonly accountId: string,
		readonly name: string,
		readonly email: string,
		readonly document: string,
		readonly password: string,
	) {
		if (!validateName(name)) throw new Error('Invalid name');
		if (!validateEmail(email)) throw new Error('Invalid email');
		if (!validateCpf(document)) throw new Error('Invalid document');
		if (!validatePassword(password)) throw new Error('Invalid password');
	}

	static create(
		name: string,
		email: string,
		document: string,
		password: string,
	) {
		const accountId = crypto.randomUUID();
		return new Account(accountId, name, email, document, password);
	}

	deposit(assetId: string, quantity: number) {
		const balance = this.balances.find(
			(balance: Balance) => balance.assetId === assetId,
		);
		if (balance) {
			balance.quantity += quantity;
		} else {
			this.balances.push({ assetId, quantity });
		}
	}
}

type Balance = {
	assetId: string;
	quantity: number;
};
