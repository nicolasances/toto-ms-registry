import { MongoClient } from 'mongodb';
import { TotoControllerConfig, ValidatorProps, Logger, SecretsManager } from "toto-api-controller";

const dbName = 'totoregistry';
const collections = {
    apis: 'apis',
};

export class ControllerConfig extends TotoControllerConfig {

    mongoUser: string | undefined;
    mongoPwd: string | undefined;

    private static mongoClient: MongoClient | null = null;
    private static mongoClientPromise: Promise<MongoClient> | null = null;

    async load(): Promise<any> {

        let promises = [];

        const secretsManager = new SecretsManager(this.hyperscaler == 'local' ? 'aws' : this.hyperscaler, this.env, this.logger!);

        promises.push(super.load());

        promises.push(secretsManager.getSecret('toto-ms-registry-mongo-user').then((value) => {this.mongoUser = value}));
        promises.push(secretsManager.getSecret('toto-ms-registry-mongo-password').then((value) => {this.mongoPwd = value}));
        
        await Promise.all(promises);

    }

    getProps(): ValidatorProps {
        return {}
    }

    async getMongoClient() {

        if (ControllerConfig.mongoClient) return ControllerConfig.mongoClient;
        if (ControllerConfig.mongoClientPromise) return ControllerConfig.mongoClientPromise;

        const mongoUrl = `mongodb://${this.mongoUser}:${this.mongoPwd}@${this.mongoHost}:27017/${dbName}`

        ControllerConfig.mongoClientPromise = new MongoClient(mongoUrl, {
            serverSelectionTimeoutMS: 5000,    // Fail fast on network issues
            socketTimeoutMS: 30000,            // Kill hung queries
            maxPoolSize: 80,                   // Up to 80 connections in the pool
        }).connect().then(client => {

            ControllerConfig.mongoClient = client;
            ControllerConfig.mongoClientPromise = null;
            
                    return client;
        }).catch(error => {

            ControllerConfig.mongoClientPromise = null;

            console.error('Failed to connect to MongoDB:', error.message);

            throw error;
        });

        return ControllerConfig.mongoClientPromise;
    }

        /**
     * Closes the MongoDB connection pool.
     * Call this during application shutdown.
     */
    static async closeMongoClient(): Promise<void> {
        
        if (ControllerConfig.mongoClient) {
            
            await ControllerConfig.mongoClient.close();
            
            ControllerConfig.mongoClient = null;
        }
    }
    
    getDBName() { return dbName }
    getCollections() { return collections }

}
