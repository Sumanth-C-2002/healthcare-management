import { useCallback, useEffect, useState } from 'react';
import { getErrorInfo } from '../api/client.js';

export default function useLoad(loader) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });

  const run = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const data = await loader();
      setState({ data, loading: false, error: '' });
    } catch (err) {
      setState({ data: null, loading: false, error: getErrorInfo(err).message });
    }
  }, [loader]);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, reload: run };
}