import Logger, { LogConfig } from '@/models/Logger';
import { useEffect, useRef } from 'react';

export type Dependency<T = unknown> = Record<string, T>;

export default function useDepedencyTracker(key: LogConfig, deps: Dependency) {
  const prevDeps = useRef<Dependency>({});

  useEffect(() => {
    const changes: Dependency<{ _old: unknown; _new: unknown }> = {};
    const logger = new Logger(key);

    Object.keys(deps).forEach(key => {
      const _old = prevDeps.current[key];
      const _new = deps[key];
      if (_old !== _new) changes[key] = { _old, _new };
    });

    if (Object.keys(changes).length > 0) logger.track(changes);

    prevDeps.current = { ...deps };
  }, [deps, key]);
}
