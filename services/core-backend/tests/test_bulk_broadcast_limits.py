# Location: services/core-backend/tests/test_bulk_broadcast_limits.py
import pytest
from app.core.tasks.broadcast_worker import check_rate_limit_throttle
import time

def test_rate_limiter_logic(monkeypatch):
    # Mock redis logic to test the throttling algorithm without an active redis server
    
    class MockPipeline:
        def __init__(self):
            self.count = 0
        def zremrangebyscore(self, *args): pass
        def zcard(self, *args): pass
        def zadd(self, *args): pass
        def expire(self, *args): pass
        def execute(self):
            return [None, self.count, None, None]
            
    class MockRedis:
        def pipeline(self):
            return MockPipeline()

    mock_redis = MockRedis()
    monkeypatch.setattr("app.core.tasks.broadcast_worker.redis_client", mock_redis)
    
    # Under limit
    mock_redis.pipeline().count = 10
    assert check_rate_limit_throttle("tenant_123") is True
    
    # Over limit
    # We patch the execute method locally for the over-limit case
    def mock_execute_over():
        return [None, 100, None, None]
        
    pipe = MockPipeline()
    pipe.execute = mock_execute_over
    
    class MockRedisOver:
        def pipeline(self): return pipe
        
    monkeypatch.setattr("app.core.tasks.broadcast_worker.redis_client", MockRedisOver())
    assert check_rate_limit_throttle("tenant_123") is False
