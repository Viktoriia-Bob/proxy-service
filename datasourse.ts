import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: '123123123',
	database: 'db',
	entities: ['./apps/*/src/**/entities/**.entity.ts'],
	migrations: ['./migrations/*.ts'],
	synchronize: false,
});

export default AppDataSource;
