export default class Password {
	private value: string;

	constructor(value: string) {
		if (!this.isValid(value)) throw new Error('Invalid password');
		this.value = value;
	}

	public isValid(value: string) {
		if (value.length < 8) return false;
		if (!value.match(/[a-z]/)) return false;
		if (!value.match(/[A-Z]/)) return false;
		if (!value.match(/[0-9]/)) return false;
		return true;
	}

	getValue() {
		return this.value;
	}
}
