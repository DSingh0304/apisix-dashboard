/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { produce } from 'immer';
import { isNotEmpty } from 'rambdax';

import type { APISIXType } from '@/types/schema/apisix';

import type { FormPartUpstreamType } from './schema';

export const produceToUpstreamForm = (
  upstream: Partial<APISIXType['Upstream']>,
  /** default to upstream */
  base: object = upstream
) =>
  produce(base, (d: FormPartUpstreamType) => {
    d.__checksEnabled = !!upstream.checks && isNotEmpty(upstream.checks);
    d.__checksPassiveEnabled =
      !!upstream.checks?.passive && isNotEmpty(upstream.checks.passive);
  });

const isAllUndefined = (obj: Record<string, unknown>) =>
  Object.values(obj).every(
    (v) => v === undefined || v === null || v === '' || Number.isNaN(v)
  );

export const produceRmEmptyUpstreamFields = produce((draft: Record<string, any>) => {
  if (draft.timeout && isAllUndefined(draft.timeout)) {
    delete draft.timeout;
  }
  if (draft.keepalive_pool && isAllUndefined(draft.keepalive_pool)) {
    delete draft.keepalive_pool;
  }
  if (draft.tls && isAllUndefined(draft.tls)) {
    delete draft.tls;
  }

  if (draft.upstream) {
    if (draft.upstream.timeout && isAllUndefined(draft.upstream.timeout)) {
      delete draft.upstream.timeout;
    }
    if (
      draft.upstream.keepalive_pool &&
      isAllUndefined(draft.upstream.keepalive_pool)
    ) {
      delete draft.upstream.keepalive_pool;
    }
    if (draft.upstream.tls && isAllUndefined(draft.upstream.tls)) {
      delete draft.upstream.tls;
    }
  }
});
