var get_ip = require('..')().get_ip,
    assert = require('assert');


describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR', function() {
  it('test_http_x_forwarded_for_multiple', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '198.84.193.157');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR', function() {
  it('test_http_x_forwarded_for_multiple_right_most_proxy', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '192.168.255.182, 198.84.193.157, 10.0.0.0, 127.0.0.1, 177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request, right_most_proxy=true);
    assert.equal(request.clientIp, '177.139.233.139');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR', function() {
  it('test_http_x_forwarded_for_multiple_bad_address', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = 'unknown, 192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '198.84.193.157');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR', function() {
  it('test_http_x_forwarded_for_singleton', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.139');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP', function() {
  it('test_http_x_forwarded_for_singleton_private_address', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '192.168.255.182';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP', function() {
  it('test_bad_http_x_forwarded_for_fallback_on_x_real_ip', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = 'unknown 177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP', function() {
  it('test_empty_http_x_forwarded_for_fallback_on_x_real_ip', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_empty_http_x_forwarded_for_empty_x_real_ip_fallback_on_remote_addr', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.133');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_empty_http_x_forwarded_for_private_x_real_ip_fallback_on_remote_addr', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '192.168.255.182';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.133');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_private_http_x_forward_for_ip_addr', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '127.0.0.1';
    request.headers.HTTP_X_REAL_IP = '';
    request.headers.REMOTE_ADDR = '';
    get_ip(request);
    assert.equal(request.clientIp, '127.0.0.1');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_private_real_ip_for_ip_addr', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '127.0.0.1';
    request.headers.REMOTE_ADDR = '';
    get_ip(request);
    assert.equal(request.clientIp, '127.0.0.1');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): IPV4: HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_private_remote_addr_for_ip_addr', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '';
    request.headers.REMOTE_ADDR = '127.0.0.1';
    get_ip(request);
    assert.equal(request.clientIp, '127.0.0.1');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): IPV4: HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_missing_http_x_forwarded', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: REMOTE_ADDR', function() {
  it('test_missing_http_x_forwarded_missing_real_ip', function() {
    var request = {headers: {}};
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.133');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_best_matched_real_ip', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_REAL_IP = '127.0.0.1';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.133');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: http_x_real_ip', function() {
  it('test_lower_case_http_x_real_ip', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.http_x_real_ip = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});


describe('get_ip(): IPV4: X_FORWARDED_FOR', function() {
  it('test_x_forwarded_for', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.X_FORWARDED_FOR = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.100';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: X_FORWARDED_FOR and HTTP_X_FORWARDED_FOR', function() {
  it('test_http_x_forwarded_for_precedence', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_FORWARDED_FOR = '80.10.1.10';
    request.headers.X_FORWARDED_FOR = '177.139.233.132';
    request.headers.REMOTE_ADDR = '';
    get_ip(request);
    assert.equal(request.clientIp, '80.10.1.10');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: Test 1.0.0.0/8 blocks', function() {
  it('test_1_0_0_0_block', function() {
    var request = {headers: {}};
    request.headers.HTTP_X_REAL_IP = '1.0.0.0';
    get_ip(request);
    assert.equal(request.clientIp, '1.0.0.0');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: Test 2.0.0.0/8 blocks', function() {
  it('test_2_0_0_0_block', function() {
    var request = {headers: {}};
    request.headers.REMOTE_ADDR = '2.0.0.1';
    get_ip(request);
    assert.equal(request.clientIp, '2.0.0.1');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): IPV4: X-FORWARDED-FOR', function() {
  it('test_http_x_forwarded_for_precedence-hyphenated', function() {
    var request = {headers: {'X-FORWARDED-FOR': '80.10.1.10'}};
    get_ip(request);
    assert.equal(request.clientIp, '80.10.1.10');
    assert.equal(request.clientIpRoutable, true);
  });
});
