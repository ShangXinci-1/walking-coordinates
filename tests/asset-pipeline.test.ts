import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";
import {
  convertAsset,
  getAssetDerivatives,
} from "../scripts/lib/asset-pipeline";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  sharp.cache(false);
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, {
        force: true,
        recursive: true,
        maxRetries: 5,
        retryDelay: 100,
      }),
    ),
  );
}, 15_000);

describe("asset conversion pipeline", () => {
  it("creates verified AVIF and WebP derivatives for a fixed asset ID", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "walking-asset-"));
    temporaryDirectories.push(directory);
    const sourcePath = path.join(directory, "source.png");
    const outputDirectory = path.join(directory, "output");

    await sharp({
      create: {
        width: 1920,
        height: 1200,
        channels: 3,
        background: "#087f80",
      },
    })
      .png()
      .toFile(sourcePath);

    const target = { id: "outcome-01", width: 960, height: 600 };
    const derivatives = await convertAsset({
      sourcePath,
      outputDirectory,
      target,
    });

    expect(derivatives).toEqual(
      getAssetDerivatives(outputDirectory, target),
    );
    expect(derivatives).toHaveLength(4);
  });

  it("rejects a source whose aspect ratio would require an unsafe crop", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "walking-asset-"));
    temporaryDirectories.push(directory);
    const sourcePath = path.join(directory, "source.png");

    await sharp({
      create: {
        width: 1200,
        height: 1200,
        channels: 3,
        background: "#087f80",
      },
    })
      .png()
      .toFile(sourcePath);

    await expect(
      convertAsset({
        sourcePath,
        outputDirectory: path.join(directory, "output"),
        target: { id: "outcome-01", width: 960, height: 600 },
      }),
    ).rejects.toThrow("宽高比");
  });
});
