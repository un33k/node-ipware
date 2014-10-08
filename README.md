Node IPware
====================

**A Node application to retrieve user's IP address**


Overview
====================

**Best attempt** to get user's (client's) real ip-address while keeping it **DRY**.

How to install
====================

    1. npm install node-ipware
    2. git clone http://github.com/un33k/node-ipware
        a. npm install node-ipware
    3. wget https://github.com/un33k/node-ipware/zipball/master
        a. unzip the downloaded file
        b. npm install node-ipware

How to use
====================

   ```javascript
    // In your js file (e.g. app.js)
    var get_ip = require('ipware')().get_ip;
    app.use(function(req, res, next) {
        get_ip(req)
        next();
    });

    // `get_ip` adds two fields to your request object
    // 1. `clientIP`, 2. `isRoutable`
    // Where:
    //    `clientIP` holds the client's IP address
    //    'isRoutable` is `true` if user's IP is `public`. (externally route-able)
    //                 is `false` if user's IP is `private`. (not externally route-able)

   ```

Advanced users:
====================

   ```javascript
    // you can use your own config file as below.
    // for `IPWARE_HTTP_HEADER_PRECEDENCE_ORDER`, the
    // check is done from top to bottom.
    // for private PREFIX lists, any IP address that doesn't
    // match those patterns is considered publicly routable.
    {
      "IPWARE_HTTP_HEADER_PRECEDENCE_ORDER": [
        "HTTP_X_FORWARDED_FOR",
        "HTTP_CLIENT_IP",
        "HTTP_X_REAL_IP",
        "HTTP_X_FORWARDED",
        "HTTP_X_CLUSTER_CLIENT_IP",
        "HTTP_FORWARDED_FOR",
        "HTTP_FORWARDED",
        "HTTP_VIA",
        "REMOTE_ADDR"
      ],

      "IPV4_EXTERNALLY_NON_ROUTABLE_IP_PREFIX": [
        "0.",
        "1.",
        "2."
      ],

      "IPV4_CLASS_A_PRIVATE_BLOCK_IP_PREFIX": [
        "10."
      ],

      "IPV4_LOCAL_LINK_BLOCK_IP_PREFIX": [
        "169.254."
      ],

      "IPV4_CLASS_B_PRIVATE_BLOCK_IP_PREFIX": [
        "172.16.",
        "172.17.",
        "172.18.",
        "172.19.",
        "172.20.",
        "172.21.",
        "172.22.",
        "172.23.",
        "172.24.",
        "172.25.",
        "172.26.",
        "172.27.",
        "172.28.",
        "172.29.",
        "172.30.",
        "172.31."
      ],

      "IPV4_EXAMPLE_CODE_DOCUMENTATION_IP_PREFIX": [
        "192.0.2."
      ],

      "IPV4_CLASS_C_PRIVATE_BLOCK_IP_PREFIX": [
        "192.168."
      ],

      "IPV4_RODCAST_IP_PREFIX": [
        "255.255.255."
      ],

      "IPV4_LOOPBACK_IP_PREFIX": [
        "127."
      ],

      "IPV6_EXAMPLE_CODE_DOCUMENTATION_IP_PREFIX": [
        "2001:db8:"
      ],

      "IPV6_CLASS_PRIVATE_BLOCK_IP_PREFIX": [
        "fc00:"
      ],

      "IPV6_LOCAL_LINK_UNICAST_IP_PREFIX": [
        "fe80:"
      ],

      "IPV6_MULTICAST_IP_PREFIX": [
        "ff00:"
      ],

      "IPV6_LOOPBACK_IP_PREFIX": [
        "::1"
      ]
    }

   ```

Running the tests
====================


License
====================

Released under a ([BSD](LICENSE.md)) license.

