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
import { pipe } from 'rambdax';

import { produceRmEmptyUpstreamFields } from '@/components/form-slice/FormPartUpstream/util';
import { produceRmUpstreamWhenHas } from '@/utils/form-producer';

import type { StreamRoutePostType } from './schema';

export const produceStreamRoute = (val: StreamRoutePostType) =>
  pipe(
    produceRmEmptyUpstreamFields,
    (produceRmUpstreamWhenHas('service_id', 'upstream_id') as unknown as (
      d: StreamRoutePostType
    ) => StreamRoutePostType),
    produce((draft: StreamRoutePostType) => {
      // Stream Routes do not support name and status
      const d = draft as StreamRoutePostType & { name?: string; status?: number };
      delete d.name;
      delete d.status;

      // Cleanup protocol if name is missing
      if (draft.protocol && !draft.protocol.name) {
        delete draft.protocol;
      }
    })
  )(val);
