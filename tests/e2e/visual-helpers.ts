import type { Page } from "@playwright/test";

export async function prepareFullPageVisual(page: Page) {
  const images = page.locator("img");

  for (let index = 0; index < (await images.count()); index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded();
  }

  await page.waitForFunction(() =>
    Array.from(document.images).every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  );
  await page.evaluate(() => window.scrollTo(0, 0));
}
