import { Request } from "express";
import { ExecutionContext, TotoDelegate, UserContext, ValidationError } from "toto-api-controller";
import { APIRegistry } from "../store/APIRegistry";
import { ControllerConfig } from "../Config";
import { APIDefinition } from "../model/APIDefinition";

export class PostEndpoint implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const config = execContext.config as ControllerConfig;
        const logger = execContext.logger!;
        const cid = execContext.cid!;

        // 1. Construct APIDefinition from body
        const apiName = req.body.apiName;
        let endpointURL = req.body.endpointURL;

        // If no endpoint is provided, build it
        if (!endpointURL) {

            const hyperscaler = req.body.hyperscaler;
            const basePath = req.body.basePath;

            if (!hyperscaler) throw new ValidationError(400, 'Either endpointURL or hyperscaler must be provided');

            if (hyperscaler === 'aws') {
                if (basePath) endpointURL = `https://${config.awsDomainName}/${basePath}`;
                else endpointURL = `https://${config.awsDomainName}`;
            }
            else if (hyperscaler == 'gcp') {
                if (basePath) endpointURL = `https://${apiName}-${config.gcpCloudRunSuffix}/${basePath}`;
                else endpointURL = `https://${apiName}-${config.gcpCloudRunSuffix}`;
            }

        }

        logger.compute(cid, `Registering new API endpoint: ${apiName} -> ${endpointURL}`);

        const apiDefinition = new APIDefinition(apiName, endpointURL)

        const insertedId = await new APIRegistry(execContext.config as ControllerConfig).registerAPI(apiDefinition);

        return {
            inserted: insertedId ? true : false,
            updated: insertedId ? false : true,
            insertedId: insertedId, 
            apiName: apiName,
            endpointURL: endpointURL
        }
    }

}