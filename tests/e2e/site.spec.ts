import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  { path: ".", heading: "革命史迹" },
  { path: "./journey", heading: "以脚步丈量" },
  { path: "./outcomes", heading: "让成果被看见" },
  { path: "./legacy", heading: "我们不是历史的访客" },
];

for (const pageCase of pages) {
  test(`${pageCase.path} renders its primary heading`, async ({ page }) => {
    await page.goto(pageCase.path);
    await expect(
      page.getByRole("heading", { level: 1, name: new RegExp(pageCase.heading) }),
    ).toBeVisible();
  });

  test(`@a11y ${pageCase.path} has no WCAG A/AA violations`, async ({
    page,
  }) => {
    await page.goto(pageCase.path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
}

test("@visual home page baseline", async ({ page }) => {
  await page.goto(".");
  await expect(page).toHaveScreenshot("home-page.png", {
    animations: "disabled",
    fullPage: true,
  });
});
