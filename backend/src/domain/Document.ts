export default class Document {
	private VALID_LENGTH = 11;
	private value: string;

	constructor(value: string) {
		if (!this.isValid(value)) throw new Error('Invalid document');
		this.value = value;
	}

	isValid(cpf: string) {
		if (!cpf) return false;
		cpf = this.clean(cpf);
		if (cpf.length !== this.VALID_LENGTH) return false;
		if (this.allDigitsTheSame(cpf)) return false;
		const dg1 = this.calculateDigit(cpf, 10);
		const dg2 = this.calculateDigit(cpf, 11);
		let nDigVerific = this.extractCheckDigit(cpf);
		return nDigVerific == `${dg1}${dg2}`;
	}

	clean(cpf: string) {
		return cpf.replace(/\D/g, '');
	}

	allDigitsTheSame(cpf: string) {
		return cpf.split('').every((c) => c === cpf[0]);
	}

	extractCheckDigit(cpf: string) {
		return cpf.slice(9);
	}

	calculateDigit(cpf: string, factor: number) {
		let total = 0;
		for (const digit of cpf) {
			if (factor > 1) total += parseInt(digit) * factor--;
		}
		const rest = total % 11;
		return rest < 2 ? 0 : 11 - rest;
	}

	getValue() {
		return this.value;
	}
}
