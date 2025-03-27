export interface IDistributedLockService {
  acquireLock(lockName: string, ttlMs: number): Promise<boolean>;
  releaseLock(lockName: string): Promise<boolean>;
}
