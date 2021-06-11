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
