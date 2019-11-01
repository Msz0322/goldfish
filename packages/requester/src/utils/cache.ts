import { PromiseCreator, withForceUpdate } from '../types';

type CacheOptions = {
  /**
   * 缓存时间，单位ms
   */
  time?: number;
};

type Config = { force: boolean };

function cache<FuncType extends PromiseCreator>(
  fn: FuncType,
  options: CacheOptions = { time: 2000 },
): FuncType {
  const { time } = options;
  let pending = false;
  let result: any;
  let resolveQueue: Array<(value?: any) => void> = [];
  let rejectQueue: Array<(reason?: any) => void> = [];

  let cacheArgs: any[];

  function createFunc(config: Config): FuncType {
    return ((...args: Array<any>) => new Promise<any>((resolve, reject) => {
      if (result && !config.force) {
        resolve(result);
        return;
      }
      // 缓存队列
      resolveQueue.push(resolve);
      rejectQueue.push(reject);
      if (pending) return;
      pending = true;
      if (args && args.length) {
        cacheArgs = args;
      }
      fn(...(args || cacheArgs))
        .then((resolveResult) => {
          if (resolveQueue.length) {
            resolveQueue.forEach((r) => r(resolveResult));
          }
          result = resolveResult;
          setTimeout(() => {
            // 1.5s后清除缓存
            result = undefined;
          }, time);
        })
        .catch((e: any) => {
          if (rejectQueue.length) {
            rejectQueue.forEach((r) => r(e));
          }
        })
        .then(() => {
          pending = false;
          resolveQueue = [];
          rejectQueue = [];
        });
    })) as FuncType;
  }
  const func = createFunc({ force: false }) as withForceUpdate<FuncType>;
  func.forceRefresh = createFunc({ force: true });
  return func;
}

export default cache;
