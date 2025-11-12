import { Request } from "express";
import { ExecutionContext, TotoDelegate, UserContext } from "toto-api-controller";
import { APIRegistry } from "../store/APIRegistry";
import { ControllerConfig } from "../Config";

export class PostEndpoint implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const insertedId = await new APIRegistry(execContext.config as ControllerConfig).registerAPI(req.body);

        return {
            inserted: insertedId ? true : false,
            updated: insertedId ? false : true,
            insertedId: insertedId
        }
    }

}