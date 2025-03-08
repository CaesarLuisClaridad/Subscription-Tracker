import {Client as WorkFlowClient} from '@upstash/workflow';

import { QSTASH_TOKEN, QSTASH_URL } from './env.js';

export const workFlowClient = new WorkFlowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN,
})