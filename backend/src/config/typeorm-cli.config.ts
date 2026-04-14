import { DataSourceOptions } from "typeorm";
import { config } from 'dotenv'

config()

export default {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postres',
    password: process.env.DB_PASSWORD || 'postres',
    database: process.env.DB_NAME || 'store',
    entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrationsTableName: 'migrations',
    synchronize: false,
    logging: true,
} as DataSourceOptions