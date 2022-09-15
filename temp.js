import { registerEmailPassword } from './src/services/users.service';

registerEmailPassword({ email: 'hola@mail.com', password: 'Password1' }).then(
	(res) => {
		console.log(res);
	}
);
