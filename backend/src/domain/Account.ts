import { validateCpf } from './validateCpf';
import { validatePassword } from './validatePassword';
import { validateEmail } from './validateEmail';
import { validateName } from './validateName';
import Name from './Name';

export default class Account {
	balances: Balance[] = [];
	private name: Name;

	constructor(
		readonly accountId: string,
		name: string,
		readonly email: string,
		readonly document: string,
		readonly password: string,
	) {
		this.name = new Name(name);
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

	withdraw(assetId: string, quantity: number) {
		const balance = this.balances.find(
			(balance: Balance) => balance.assetId === assetId,
		);
		if (!balance || balance.quantity < quantity)
			throw new Error('Insuficient funds');
		balance.quantity -= quantity;
	}

	getName() {
		return this.name.getValue();
	}
}

type Balance = {
	assetId: string;
	quantity: number;
};
