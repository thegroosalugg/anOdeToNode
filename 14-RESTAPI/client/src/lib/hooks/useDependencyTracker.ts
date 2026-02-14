import Logger, { LogConfig } from '@/models/Logger';
import { useEffect, useRef } from 'react';
import { RecordMap } from '../types/common';

export type Dependency<T = unknown> = RecordMap<T>;

export function useDependencyTracker(key: LogConfig, deps: Dependency) {
  const prevDeps = useRef<Dependency>({});

  useEffect(() => {
    const changes: Dependency<{ prev: unknown; next: unknown }> = {};
    const logger = new Logger(key);

    Object.keys(deps).forEach(key => {
      const prev = prevDeps.current[key];
      const next = deps[key];
      if (prev !== next) changes[key] = { prev, next };
    });

    if (Object.keys(changes).length > 0) logger.track(changes);

    prevDeps.current = { ...deps };
  }, [deps, key]);
}
