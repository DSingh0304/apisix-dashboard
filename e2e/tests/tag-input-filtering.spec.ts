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

import { test } from '@e2e/utils/test';
import { uiGoto } from '@e2e/utils/ui';
import { expect } from '@playwright/test';

import { API_ROUTES } from '@/config/constant';

const routeId = 'test-tag-input-filtering';

test.describe('TagInput filtering of non-string values', () => {
  test('should filter out non-string values from TagsInput and not crash the UI', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'warning' && msg.text().includes('[TagInput]')) {
        warnings.push(msg.text());
      }
    });

    // Mock the API call to return invalid data in a tags field (methods)
    await page.route(`**${API_ROUTES}/${routeId}`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          key: `/apisix/routes/${routeId}`,
          value: {
            id: routeId,
            name: routeId,
            uri: '/test-filtering',
            methods: ['GET', 123, null, 'POST'], // Non-string values
            upstream: {
              type: 'roundrobin',
              nodes: [{ host: 'httpbin.org', port: 80, weight: 1 }],
            },
          },
        }),
      });
    });

    // Navigate to the route detail page
    await uiGoto(page, '/routes/detail/$id', { id: routeId });

    // Verify the page heading 'Route Detail' is visible, confirming no early React crash
    const heading = page.getByRole('heading', { name: 'Route Detail' });
    await expect(heading).toBeVisible({ timeout: 10000 });

    // Verify the filtering occurred and was logged
    // We wait a bit for the component to render and log
    await expect.poll(() => warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain('Filtered out non-string value');
    
    // Final check for 'GET' tag presence helps confirm the component actually rendered
    await expect(page.locator('div').filter({ hasText: 'HTTP Methods' }).first()).toContainText('GET');
  });
});
