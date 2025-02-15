/*
Copyright 2023 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { renderHook } from '@testing-library/react-hooks';

import { useGetTargetData } from './useGetTargetData';

import {
  mockedUseTeleportUtils,
  ROLES_RESULT,
  USER_RESULT,
} from './testFixtures';

jest.mock('teleport/useTeleport', () => ({
  __esModule: true,
  default: () => mockedUseTeleportUtils,
}));

describe('hook: useLocks', () => {
  describe('can fetch and filter', () => {
    it('mfa data', async () => {
      async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
          useGetTargetData('windows_desktop', 'cluster-id')
        );
        await waitForNextUpdate();
        expect(result.current).toStrictEqual([
          {
            name: 'yubikey',
            id: '4bac1adb-fdaa-4c31-a989-317892a9d1bd',
            description: 'Hardware Key',
            lastUsed: 'Tue, 21 Mar 2023 19:03:54 GMT',
          },
        ]);
      };
    });

    it('desktops data', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useGetTargetData('windows_desktop', 'cluster-id')
      );
      await waitForNextUpdate();
      expect(result.current).toStrictEqual([
        {
          name: 'watermelon',
          targetValue: 'watermelon',
          addr: 'localhost.watermelon',
          labels: [
            {
              name: 'env',
              value: 'test',
            },
            {
              name: 'os',
              value: 'os',
            },
            {
              name: 'unique-id',
              value: '47c38f49-b690-43fd-ac28-946e7a0a6188',
            },
            {
              name: 'windows-desktops',
              value: 'watermelon',
            },
          ],
        },
        {
          name: 'banana',
          targetValue: 'banana',
          addr: 'localhost.banana',
          labels: [
            {
              name: 'env',
              value: 'test',
            },
            {
              name: 'os',
              value: 'linux',
            },
            {
              name: 'unique-id',
              value: '4c3bd959-8444-492a-a383-a29378da93c9',
            },
            {
              name: 'windows-desktops',
              value: 'banana',
            },
          ],
        },
      ]);
    });

    it('nodes data', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useGetTargetData('node', 'cluster-id')
      );
      await waitForNextUpdate();
      expect(result.current).toStrictEqual([
        {
          name: 'node1.go.citadel',
          targetValue: 'e14baac6-15c1-42c2-a7d9-99410d21cf4c',
          addr: '127.0.0.1:4022',
          labels: ['special:apple', 'user:orange'],
        },
      ]);
    });

    it('roles data', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useGetTargetData('role', 'cluster-id')
      );
      await waitForNextUpdate();
      expect(result.current).toStrictEqual(ROLES_RESULT);
    });

    it('user data', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useGetTargetData('user', 'cluster-id')
      );
      await waitForNextUpdate();
      expect(result.current).toStrictEqual(USER_RESULT);
    });

    it('additionally supplied targets', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useGetTargetData('access_request', 'cluster-id', additionalTargets)
      );
      await waitForNextUpdate();
      expect(result.current).toStrictEqual([accessRequestData]);
    });
  });
});

const accessRequestData = {
  id: '942a14e8-6a16-40bb-a873-725cec0a3cca',
  user: 'jane',
  roles: 'access, editor',
  created: new Date().toDateString(),
  reason: 'testing',
  targetValue: '942a14e8-6a16-40bb-a873-725cec0a3cca',
};

const additionalTargets = {
  access_request: {
    fetchData: async () => [accessRequestData],
  },
};
