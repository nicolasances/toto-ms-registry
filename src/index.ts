import { TotoAPIController } from "toto-api-controller";
import { ControllerConfig } from "./Config";
import { GetEndpoints } from "./dlg/GetEndpoints";

const api = new TotoAPIController(new ControllerConfig({ apiName: "toto-ms-registry" }), { basePath: '/totoregistry' });

api.path('GET', '/apis', new GetEndpoints())

api.init().then(() => {
    api.listen()
});