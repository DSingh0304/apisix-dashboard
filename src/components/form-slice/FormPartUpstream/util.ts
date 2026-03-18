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

const isAllUndefined = (obj: Record<string, any>) =>
  Object.values(obj).every((v) => v === undefined);

export const produceRmEmptyUpstreamFields = produce((draft: any) => {
  const target = draft.upstream ? draft.upstream : draft;
  if (target.timeout && isAllUndefined(target.timeout)) {
    delete target.timeout;
  }
  if (target.keepalive_pool && isAllUndefined(target.keepalive_pool)) {
    delete target.keepalive_pool;
  }
  if (target.tls && isAllUndefined(target.tls)) {
    delete target.tls;
  }
});
