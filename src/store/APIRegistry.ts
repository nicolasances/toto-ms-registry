import { ControllerConfig } from "../Config";
import { APIDefinition } from "../model/APIDefinition";

export class APIRegistry {

    constructor(private config: ControllerConfig) {}


    /**
     * Register a new API definition in the registry. 
     * If the API already exists, it will be updated.
     * 
     * @param apiDefinition the API definition
     * @returns the inserted ID
     */
    async registerAPI(apiDefinition: APIDefinition): Promise<string> {

        const mongoClient = await this.config.getMongoClient();
        const db = mongoClient.db(this.config.getDBName());

        const apisCollection = db.collection(this.config.getCollections().apis);

        const result = await apisCollection.updateOne({apiName: apiDefinition.apiName}, {$set: apiDefinition}, {upsert: true});

        return result.upsertedId ? result.upsertedId.toHexString() : '';

    }

    /**
     * Get a list of all registered APIs.
     * @returns the list of all registered APIs
     */
    async getAPIs(): Promise<APIDefinition[]> {

        const mongoClient = await this.config.getMongoClient();
        const db = mongoClient.db(this.config.getDBName());

        const apisCollection = db.collection(this.config.getCollections().apis);

        const apis = await apisCollection.find({}).toArray() as any[];

        return apis.map(api => APIDefinition.fromMongoDoc(api));
    }

}