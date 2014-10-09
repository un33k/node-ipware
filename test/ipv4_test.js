var get_ip = require('..')().get_ip,
    assert = require('assert'),
    request = {'headers': {'connection': {'remoteAddress': '172.0.0.1'}}};


describe('get_ip(): HTTP_X_FORWARDED_FOR', function() {
  it('test_x_forwarded_for_multiple', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '198.84.193.157');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): HTTP_X_FORWARDED_FOR', function() {
  it('test_x_forwarded_for_multiple_bad_address', function() {
    request.headers.HTTP_X_FORWARDED_FOR = 'unknown, 192.168.255.182, 10.0.0.0, 127.0.0.1, 198.84.193.157, 177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '198.84.193.157');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): HTTP_X_FORWARDED_FOR', function() {
  it('test_x_forwarded_for_singleton', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.139');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP', function() {
  it('test_x_forwarded_for_singleton_private_address', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '192.168.255.182';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP', function() {
  it('test_bad_x_forwarded_for_fallback_on_x_real_ip', function() {
    request.headers.HTTP_X_FORWARDED_FOR = 'unknown 177.139.233.139';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP', function() {
  it('test_empty_x_forwarded_for_fallback_on_x_real_ip', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_empty_x_forwarded_for_empty_x_real_ip_fallback_on_remote_addr', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.133');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_empty_x_forwarded_for_private_x_real_ip_fallback_on_remote_addr', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '192.168.255.182';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.133');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_private_x_forward_for_ip_addr', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '127.0.0.1';
    request.headers.HTTP_X_REAL_IP = '';
    request.headers.REMOTE_ADDR = '';
    get_ip(request);
    assert.equal(request.clientIp, '127.0.0.1');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_private_real_ip_for_ip_addr', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '127.0.0.1';
    request.headers.REMOTE_ADDR = '';
    get_ip(request);
    assert.equal(request.clientIp, '127.0.0.1');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): HTTP_X_FORWARDED_FOR & HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_private_remote_addr_for_ip_addr', function() {
    request.headers.HTTP_X_FORWARDED_FOR = '';
    request.headers.HTTP_X_REAL_IP = '';
    request.headers.REMOTE_ADDR = '127.0.0.1';
    get_ip(request);
    assert.equal(request.clientIp, '127.0.0.1');
    assert.equal(request.clientIpRoutable, false);
  });
});

describe('get_ip(): HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_missing_x_forwarded', function() {
    request.headers.HTTP_X_REAL_IP = '177.139.233.132';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): REMOTE_ADDR', function() {
  it('test_missing_x_forwarded_missing_real_ip', function() {
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.132');
    assert.equal(request.clientIpRoutable, true);
  });
});

describe('get_ip(): HTTP_X_REAL_IP & REMOTE_ADDR', function() {
  it('test_best_matched_real_ip', function() {
    request.headers.HTTP_X_REAL_IP = '127.0.0.1';
    request.headers.REMOTE_ADDR = '177.139.233.133';
    get_ip(request);
    assert.equal(request.clientIp, '177.139.233.133');
    assert.equal(request.clientIpRoutable, true);
  });
});
