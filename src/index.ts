import { TotoAPIController } from "toto-api-controller";
import { ControllerConfig } from "./Config";
import { GetEndpoints } from "./dlg/GetEndpoints";
import { PostEndpoint } from "./dlg/PostEndpoint";

const api = new TotoAPIController(new ControllerConfig({ apiName: "toto-ms-registry" }), { basePath: '/totoregistry' });

api.path('GET', '/apis', new GetEndpoints());
api.path('POST', '/apis', new PostEndpoint());

api.init().then(() => {
    api.listen()
});

const shutdown = async () => {

    console.log('Shutting down gracefully...');
    
    await ControllerConfig.closeMongoClient();
    
    process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);