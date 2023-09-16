import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

import type { Router } from '../../../backend-web/src/index';

export const api = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: 'http://localhost:3000/trpc'
		})
	]
});
