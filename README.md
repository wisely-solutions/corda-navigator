# Corda Navigator

Run this on your network (not recommended for production networks).
It allows you to inspect multiple corda nodes vaults.

## Run Docker

    docker run -v <cordapps>:/navigator/cordapps -p 8083:8083 wiselysolutions/corda-navigator

You can optionally provide the /navigator/config.json to initialise the navigator with pre-configured nodes.

    docker run -v <config>:/navigator/config.json -v <cordapps>:/navigator/cordapps -p 8083:8083  wiselysolutions/corda-navigator

## Configuration Example

```json
{
  "nodes": [
    {
      "name": "Node",
      "host": "localhost",
      "port": 16001,
      "username": "user",
      "password": "pass"
    }
  ]
}
```

- `node.name` cannot have white spaces or special characters, it is used as id (needs to be unique in the list)
- `node.host` the host of the corda node
- `node.port` the port of the RPC service in the corda node
- `node.username` and `node.password` are used to authenticate via RPC