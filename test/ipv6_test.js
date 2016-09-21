var get_ip = require('..')().get_ip,
    get_trusted_ip = require('..')().get_trusted_ip,
    assert = require('assert');


describe('get_ip(): IPV6: HTTP_X_FORWARDED_FOR', function() {
  it('test_http_x_forwarded_for_multiple', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '3ffe:1900:4545:3:200:f8ff:fe21:67cf, 74dc::02ba';
    request.headers.HTTP_X_REAL_IP = '74dc::02ba';
    request.headers.REMOTE_ADDR = '74dc::02ba';
    get_ip(request);
    assert.equal(request.clientIp, '3ffe:1900:4545:3:200:f8ff:fe21:67cf');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: X_FORWARDED_FOR', function() {
  it('test_x_forwarded_for_single', function() {
    var request = {headers: {}};
    request.headers.X_FORWARDED_FOR = '3ffe:1900:4545:3:200:f8ff:fe21:67cf';
    request.headers.REMOTE_ADDR = '74dc::02ba';
    get_ip(request);
    assert.equal(request.clientIp, '3ffe:1900:4545:3:200:f8ff:fe21:67cf');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: HTTP_X_FORWARDED_FOR', function() {
  it('test_http_x_forwarded_for_multiple_bad_address', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = 'unknown, ::1/128, 74dc::02ba';
    request.headers.HTTP_X_REAL_IP = '3ffe:1900:4545:3:200:f8ff:fe21:67cf';
    request.headers.REMOTE_ADDR = '3ffe:1900:4545:3:200:f8ff:fe21:67cf';
    get_ip(request);
    assert.equal(request.clientIp, '74dc::02ba');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: HTTP_X_FORWARDED_FOR', function() {
  it('test_http_x_forwarded_for_singleton', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '74dc::02ba';
    request.headers.HTTP_X_REAL_IP = '3ffe:1900:4545:3:200:f8ff:fe21:67cf';
    request.headers.REMOTE_ADDR = '3ffe:1900:4545:3:200:f8ff:fe21:67cf';
    get_ip(request);
    assert.equal(request.clientIp, '74dc::02ba');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP', function() {
  it('test_http_x_forwarded_for_singleton_private_address', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '::1/128';
    request.headers.HTTP_X_REAL_IP = '74dc::02ba';
    request.headers.REMOTE_ADDR = '3ffe:1900:4545:3:200:f8ff:fe21:67cf';
    get_ip(request);
    assert.equal(request.clientIp, '74dc::02ba');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP', function() {
  it('test_bad_http_x_forwarded_for_fallback_on_x_real_ip', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = 'unknown ::1/128';
    request.headers.HTTP_X_REAL_IP = '74dc::02ba';
    request.headers.REMOTE_ADDR = '3ffe:1900:4545:3:200:f8ff:fe21:67cf';
    get_ip(request);
    assert.equal(request.clientIp, '74dc::02ba');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP', function() {
  it('test_empty_http_x_forwarded_for_fallback_on_x_real_ip', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '74dc::02ba';
    request.headers.REMOTE_ADDR = '3ffe:1900:4545:3:200:f8ff:fe21:67cf';
    get_ip(request);
    assert.equal(request.clientIp, '74dc::02ba');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_empty_http_x_forwarded_for_empty_x_real_ip_fallback_on_remote_addr', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '';
    request.headers.REMOTE_ADDR = '74dc::02ba';
    get_ip(request);
    assert.equal(request.clientIp, '74dc::02ba');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_empty_http_x_forwarded_for_private_x_real_ip_fallback_on_remote_addr', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '::1/128';
    request.headers.REMOTE_ADDR = '74dc::02ba';
    get_ip(request);
    assert.equal(request.clientIp, '74dc::02ba');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_private_http_x_forward_for_ip_addr', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '::1/128';
    request.headers.HTTP_X_REAL_IP = '';
    request.headers.REMOTE_ADDR = '';
    get_ip(request);
    assert.equal(request.clientIp, '::1/128');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): IPV6: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_private_real_ip_for_ip_addr', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '::1/128';
    request.headers.REMOTE_ADDR = '';
    get_ip(request);
    assert.equal(request.clientIp, '::1/128');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): IPV6: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_private_remote_addr_for_ip_addr', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '';
    request.headers.REMOTE_ADDR = '::1/128';
    get_ip(request);
    assert.equal(request.clientIp, '::1/128');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): IPV6: HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_missing_http_x_forwarded', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_REAL_IP = '74dc::02ba';
    request.headers.REMOTE_ADDR = '74dc::02ba';
    get_ip(request);
    assert.equal(request.clientIp, '74dc::02ba');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: REMOTE_ADDR', function() {
  it('test_missing_http_x_forwarded_missing_real_ip', function() {
    var request = {headers: {}};
    request.headers.REMOTE_ADDR = '74dc::02ba';
    get_ip(request);
    assert.equal(request.clientIp, '74dc::02ba');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_missing_http_x_forwarded_missing_real_ip_mix_case', function() {
    var request = {headers: {}};
    request.headers.REMOTE_ADDR = '74dC::02bA';
    get_ip(request);
    assert.equal(request.clientIp, '74dC::02bA');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_private_remote_address', function() {
    var request = {headers: {}};
    request.headers.REMOTE_ADDR = 'fe80::02ba';
    get_ip(request);
    assert.equal(request.clientIp, 'fe80::02ba');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): IPV6: HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_best_matched_real_ip', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_REAL_IP = '::1';
    request.headers.REMOTE_ADDR = 'fe80::02ba';
    get_ip(request);
    assert.equal(request.clientIp, 'fe80::02ba');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): IPV6: http_x_real_ip', function() {
  it('test_lower_case_http_x_real_ip', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = 'fe80::02ba';
    request.headers.http_x_real_ip = '74dC::02bA';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '74dC::02bA');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: http_x_real_ip', function() {
  it('test_fallback_on_request.connection.remoteAddress.private', function() {
    var request = {headers: {}};
    request.connection = {};
    request.connection.remoteAddress = "::1";
    get_ip(request);
    assert.equal(request.clientIp, '::1');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): IPV6: http_x_real_ip', function() {
  it('test_fallback_on_request.connection.remoteAddress.public', function() {
    var request = {headers: {}, connection: {}};
    request.connection.remoteAddress = "74dC::02bA";
    get_ip(request);
    assert.equal(request.clientIp, '74dC::02bA');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: http_x_real_ip', function() {
  it('test_fallback_on_request.socket.remoteAddress.public', function() {
    var request = {headers: {}, socket: {}};
    request.socket.remoteAddress = "74dC::02bA";
    get_ip(request);
    assert.equal(request.clientIp, '74dC::02bA');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV6: X-FORWARDED-FOR', function() {
  it('test_http_x_forwarded_for_precedence-hyphenated', function() {
    var request = {headers: {'X-FORWARDED-FOR': '74dC::02bA'}};
    get_ip(request);
    assert.equal(request.clientIp, '74dC::02bA');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_trusted_ip(): IPV6: HTTP_X_FORWARDED_FOR', function() {
  it('test_http_x_forwarded_for_multiple', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '3ffe:1900:4545:3:200:f8ff:fe21:67cf, 74dc::02ba, 74dc::02bb';
    var trusted_proxy_list = ['74dc::02bb'];
    get_trusted_ip(request, trusted_proxy_list);
    assert.equal(request.clientIp, '3ffe:1900:4545:3:200:f8ff:fe21:67cf');
    assert.equal(request.clientIpRoutable, true);
  });
});
