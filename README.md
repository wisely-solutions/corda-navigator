# Corda Navigator

Run this on your network (not recommended for production networks).
It allows you to inspect multiple corda nodes vaults.

## Run Docker

    docker run -v <cordapps>:/navigator/cordapps -p 8083:8083 wiselylda/corda-navigator

You can optionally provide the /navigator/config.json to initialise the navigator with pre-configured nodes.

    docker run -v <config>:/navigator/config.json -v <cordapps>:/navigator/cordapps -p 8083:8083  wiselylda/corda-navigator

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