import { useCallback, useRef } from 'react';
import { captainsLog } from '@/util/captainsLog';

const logs: [[number, number], unknown[]][] = [
  [[  -1, -99], ["🪵 Captain's Log"        ]], // 0
  [[  -1,  70], ['🗞️ FEEDPAGE mountData'   ]], // 1
  [[ -80, 225], ['⚽ SOCIAL PAGE mountData']], // 2
  [[ -90, 204], ['🧭 NAV: getReplyAlerts'  ]], // 3
  [[-100, 270], ['🗨️  MESSAGES'            ]], // 4
  [[-100, 290], ['CHAT LIST 💬'            ]], // 5
  [[-100, -55], ['👤 USER PAGE mountData'  ]], // 6
];

export default function useInitial() {
  const initialRef = useRef(true);

  const mountData = useCallback(async <T>(req: () => Promise<T | void>, i: number) => {
    if (initialRef.current) {
      await req();
      initialRef.current = false;
      captainsLog(...logs[i % logs.length]);
    }
  }, []);

  const setInit = (value: boolean) => initialRef.current = value;

  return { isInitial: initialRef.current, mountData, setInit };
}
