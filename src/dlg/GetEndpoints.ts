import { Request } from "express";
import { ExecutionContext, TotoDelegate, UserContext } from "toto-api-controller";
import { APIRegistry } from "../store/APIRegistry";
import { ControllerConfig } from "../Config";

export class GetEndpoints implements TotoDelegate {

    async do(req: Request, userContext: UserContext, execContext: ExecutionContext): Promise<any> {

        const apis = await new APIRegistry(execContext.config as ControllerConfig).getAPIs();

        return { apis }

    }

}