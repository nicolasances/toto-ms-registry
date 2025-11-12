import { ValidationError } from "toto-api-controller";


export class APIDefinition {

    apiName: string;        // e.g. toto-ms-ex1
    endpointURL: string;    // e.g. https://api.example.com/toto-ms-ex1/ex1 (includes basePath, if any)

    constructor(apiName: string, endpointURL: string) {
        this.apiName = apiName;
        this.endpointURL = endpointURL;
    }

    static fromMongoDoc(doc: any) {
        return new APIDefinition(doc.apiName, doc.endpointURL);
    }

    static fromHTTPBody(body: any) {

        // Validate
        if (!body.apiName) throw new ValidationError(400, 'apiName is required');
        if (!body.endpointURL) throw new ValidationError(400, 'endpointURL is required');

        return new APIDefinition(body.apiName, body.endpointURL);
    }
}