/*
  Remoji - Discord emoji manager bot
  Copyright (C) 2021 Shino <shinotheshino@gmail.com>.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { arrayFilterInPlace } from "./utils";

interface RatelimitBackend {
  take(allowed: number, interval: number, bucket: string, ...identifier: string[]): boolean | Promise<boolean>;
  bucket(allowed: number, interval: number, bucket: string): RatelimitBucket;
}

export interface RatelimitBucket {
  take(identifier0: string, ...identifier: string[]): boolean | Promise<boolean>;
}

export class RatelimitBackendNative implements RatelimitBackend {
  readonly trackers = new Map<string, number[]>();

  private getBucket(key: string): number[] {
    const bucket = this.trackers.get(key);
    if (bucket) return bucket;
    else {
      const newBucket = [] as number[];
      this.trackers.set(key, newBucket);
      return newBucket;
    }
  }

  take(allowed: number, interval: number, bucket: string, ...identifier: string[]): boolean {
    const now = Date.now();
    const key = `${bucket}:${identifier.join(":")}`;

    const bucketEntry = this.getBucket(key);

    arrayFilterInPlace(bucketEntry, x => x < now - interval * 1000);
    if (bucketEntry.length >= allowed) return false;

    bucketEntry.push(now);
    return true;
  }

  bucket(allowed: number, interval: number, bucket: string): RatelimitBucket {
    const self = this;
    return {
      take(...identifier: string[]) {
        const now = Date.now();
        const key = `${bucket}:${identifier.join(":")}`;
        const bucketEntry = self.getBucket(key);

        arrayFilterInPlace(bucketEntry, x => x >= now - interval * 1000);
        if (bucketEntry.length >= allowed) return false;

        bucketEntry.push(now);
        return true;
      },
    };
  }
}

export class RatelimitManager {
  private backend: RatelimitBackend;

  constructor(backend: RatelimitBackend) {
    this.backend = backend;
  }

  take(allowed: number, interval: number, bucket: string, ...identifier: string[]): boolean | Promise<boolean> {
    return this.backend.take(allowed, interval, bucket, ...identifier);
  }

  bucket(allowed: number, interval: number, bucket: string): RatelimitBucket {
    return this.backend.bucket(allowed, interval, bucket);
  }
}
