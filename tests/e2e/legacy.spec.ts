import { expect, test } from "@playwright/test";
import { prepareFullPageVisual } from "./visual-helpers";

test("legacy page keeps unverified people and impact content explicit", async ({
  page,
}) => {
  await page.goto("./legacy");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "寻访之后，什么真正留了下来？",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "人物原话待实践记录核验后发布。",
    }),
  ).toBeVisible();
  await expect(page.locator(".legacy-impact__feature li")).toHaveCount(4);
  await expect(page.locator(".legacy-timeline__body li")).toHaveCount(4);
  await expect(
    page.getByText("联系团队 · 公开方式待补充", { exact: true }),
  ).toHaveAttribute("aria-disabled", "true");
});

test("legacy page remains within the mobile viewport", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-430");

  await page.goto("./legacy");
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
  }));

  expect(dimensions.page).toBe(dimensions.viewport);
});

test("@visual legacy page baseline", async ({ page }) => {
  await page.goto("./legacy");
  await prepareFullPageVisual(page);
  await expect(page).toHaveScreenshot("legacy-page.png", {
    animations: "disabled",
    fullPage: true,
  });
});
