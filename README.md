# Toto Registry

This microservice acts as a registry of all the APIs published within the Toto Ecosystem. 

## Registering a microservice

To register a Microservice in the Toto Registry, perform the following API call: 

<code>
POST <registry-endpoint>/apis
</code>

with the following payload: 

```
{
    apiName: "toto-ms-ex1",     // Logical name of the microservice
    endpointURL: "https://...."    // Endpoint of the microservice: the base URL only, but including any configured base path (e.g. https://toto-ms-ex1-domain.com/ex1)
}
```

An alternative way of registering, without passing `endpointURL` is to provide both of the following: 
* `hyperscaler` (either aws or gcp)
* `basePath` if any

```
{
    apiName: "toto-ms-ex1", 
    hyperscaler: "aws", 
    basePath: "ex1"
}
```
The endpoint will then be constructed automatically by the Registry.

## Retrieving endpoints
That's simple: 

```
GET <registry-endpoint>/apis
```

