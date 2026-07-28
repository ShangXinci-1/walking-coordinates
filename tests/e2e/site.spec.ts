import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { prepareFullPageVisual } from "./visual-helpers";

const pages = [
  { path: ".", heading: "革命史迹" },
  { path: "./journey", heading: "以脚步丈量" },
  { path: "./outcomes", heading: "让每一项成果" },
  { path: "./legacy", heading: "寻访之后" },
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

test("home page exposes its project evidence and primary route action", async ({
  page,
}) => {
  await page.goto(".");

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "革命史迹数字化寻访",
  );
  await expect(page.getByRole("link", { name: "从路线开始" })).toBeVisible();
  await expect(page.getByText("14 天", { exact: true })).toBeVisible();
  await expect(page.getByText("3 条", { exact: true })).toBeVisible();
  await expect(page.getByText("13 处", { exact: true })).toBeVisible();
  await expect(page.getByText("示意素材阶段", { exact: true })).toBeVisible();
});

test("430px home page stays within the viewport and separates the hero quote", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-430");

  await page.goto(".");
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }));
  const visualBox = await page.locator(".home-hero__visual").boundingBox();
  const statementBox = await page.locator(".home-hero__statement").boundingBox();

  expect(dimensions.page).toBe(dimensions.viewport);
  expect(visualBox).not.toBeNull();
  expect(statementBox).not.toBeNull();
  expect(statementBox!.y).toBeGreaterThanOrEqual(
    visualBox!.y + visualBox!.height - statementBox!.height - 1,
  );
});

test("@visual home page baseline", async ({ page }) => {
  await page.goto(".");
  await prepareFullPageVisual(page);
  await expect(page).toHaveScreenshot("home-page.png", {
    animations: "disabled",
    fullPage: true,
  });
});

test("@visual home page reduced motion baseline", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(".");
  await prepareFullPageVisual(page);
  await expect(page).toHaveScreenshot("home-page-reduced-motion.png", {
    animations: "disabled",
    fullPage: true,
  });
});
