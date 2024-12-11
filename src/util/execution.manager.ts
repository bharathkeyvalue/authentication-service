import { v4 as UUIDV4 } from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';

export class ExecutionManager {
  private static asl: AsyncLocalStorage<Map<string, any>>;

  static init() {
    ExecutionManager.asl = new AsyncLocalStorage();
  }

  static runWithContext<R>(callback: (...args: any[]) => R): R {
    return ExecutionManager.getExecutionContext().run(
      new Map([
        ['id', UUIDV4()],
        ['startTime', new Date().toISOString()],
      ]),
      () => callback.apply(this),
    );
  }

  private static getExecutionContext() {
    return ExecutionManager.asl;
  }

  public static getFromContext<T>(key: string) {
    return ExecutionManager.getExecutionContext()?.getStore()?.get(key) as T;
  }

  public static setInContext(key: string, value: any) {
    ExecutionManager.getExecutionContext()?.getStore()?.set(key, value);
  }

  static setTenantId(tenantId: string) {
    ExecutionManager.setInContext('tenantId', tenantId);
  }

  static getTenantId() {
    return ExecutionManager.getFromContext<string>('tenantId');
  }
}
