import parseENSAddress from "lib/utils/parseENSAddress";
import uriToHttp from "lib/utils/uriToHttp";
import { useMemo } from "react";

export default function useHttpLocations(
  uri: string | undefined | null,
): string[] {
  const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri]);

  return useMemo(() => {
    return uri ? uriToHttp(uri) : [];
  }, [ens, uri]);
}
