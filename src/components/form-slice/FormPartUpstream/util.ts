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
const isFieldEmpty = (v: unknown) =>
  v === undefined || v === null || v === '' || Number.isNaN(v);

const removeEmptyInplace = (obj: Record<string, unknown>) => {
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      removeEmptyInplace(value as Record<string, unknown>);
      if (Object.keys(value as Record<string, unknown>).length === 0) {
        delete obj[key];
      }
    } else if (isFieldEmpty(value)) {
      delete obj[key];
    }
  }
};

export const produceRmEmptyUpstreamFields = produce((draft: Record<string, unknown>) => {
  const fields = ['timeout', 'keepalive_pool', 'tls', 'checks', 'upstream'];
  for (const field of fields) {
    if (draft[field] && typeof draft[field] === 'object' && !Array.isArray(draft[field])) {
      removeEmptyInplace(draft[field] as Record<string, unknown>);
      if (Object.keys(draft[field] as Record<string, unknown>).length === 0) {
        delete draft[field];
      }
    }
  }
});
export const produceToNestedUpstreamForm = produce((draft: Record<string, unknown>) => {
  const d = draft as Record<string, unknown> & { 
    upstream?: Record<string, unknown>;
    checks?: { passive?: unknown };
    __checksEnabled?: boolean;
    __checksPassiveEnabled?: boolean;
  };
  if (d.upstream && typeof d.upstream === 'object' && !Array.isArray(d.upstream)) {
    d.upstream = produceToUpstreamForm(d.upstream, d.upstream) as Record<string, unknown>;
  }
  // Also handle top-level checks if they exist
  if (d.checks) {
    d.__checksEnabled = !!d.checks && isNotEmpty(d.checks);
    d.__checksPassiveEnabled = !!d.checks?.passive && isNotEmpty(d.checks.passive);
  }
});
