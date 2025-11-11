import { TotoAPIController } from "toto-api-controller";
import { ControllerConfig } from "./Config";

const api = new TotoAPIController(new ControllerConfig({ apiName: "toto-ms-registry" }), { basePath: '/totoregistry' });

// api.path('POST', '/something', new PostSomething())

api.init().then(() => {
    api.listen()
});