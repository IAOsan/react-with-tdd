import SecureLs from 'secure-ls';

const secureLs = new SecureLs();

export function setItem(key, value) {
	secureLs.set(key, value);
}

export function getItem(key) {
	return secureLs.get(key);
}

export function clear() {
	secureLs.clear();
}
