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

test("desktop navigation marks the current page", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440");

  await page.goto("./journey");
  const currentLink = page
    .getByRole("navigation", { name: "主导航" })
    .getByRole("link", { name: "寻访路线", exact: true });

  await expect(currentLink).toHaveAttribute("aria-current", "page");
  await expect(currentLink).toBeVisible();
});

test("mobile navigation opens, meets the touch target, and closes with Escape", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-320");

  await page.goto(".");
  const menuButton = page.locator(".global-header__menu-button");
  await expect(menuButton).toHaveAccessibleName("打开主导航");
  const buttonBox = await menuButton.boundingBox();

  expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
  expect(buttonBox?.height).toBeGreaterThanOrEqual(44);

  await menuButton.click();
  await expect(
    page.getByRole("navigation", { name: "移动端主导航" }),
  ).toBeVisible();
  await expect(menuButton).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "移动端主导航" }),
  ).toBeHidden();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

test("@visual home page baseline", async ({ page }) => {
  await page.goto(".");
  await expect(page).toHaveScreenshot("home-page.png", {
    animations: "disabled",
    fullPage: true,
  });
});
