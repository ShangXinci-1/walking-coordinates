import { expect, test } from "@playwright/test";
import { prepareFullPageVisual } from "./visual-helpers";

test("outcome records never expose unavailable access actions", async ({
  page,
}) => {
  await page.goto("./outcomes");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "让每一项成果，都带着清楚的状态被看见。",
    }),
  ).toBeVisible();
  await expect(page.locator(".outcome-record")).toHaveCount(4);
  await expect(page.locator(".outcome-record__access")).toHaveCount(0);
  await expect(
    page.getByText("尚无公开入口", { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator(".outcome-record__gate"),
  ).toHaveCount(4);
});

test("gallery dialog supports keyboard navigation and focus restoration", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1024");

  await page.goto("./outcomes");
  const firstTrigger = page.getByRole("button", {
    name: "查看第 1 张：现场寻访",
  });

  await firstTrigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "现场寻访", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "关闭图片灯箱" }),
  ).toBeFocused();

  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("heading", { name: "青年同行", exact: true }),
  ).toBeVisible();

  for (let index = 0; index < 6; index += 1) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(firstTrigger).toBeFocused();
});

test("failed outcome images keep the page usable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-430");

  await page.route("**/images/*.svg", (route) => route.abort());
  await page.goto("./outcomes");

  await expect(page.locator(".responsive-media-fallback").first()).toBeVisible();
  await expect(page.locator(".outcome-record")).toHaveCount(4);
  await expect(
    page.getByRole("link", { name: "浏览完整路线" }),
  ).toBeVisible();
});

test("@visual outcomes page baseline", async ({ page }) => {
  await page.goto("./outcomes");
  await prepareFullPageVisual(page);
  await expect(page).toHaveScreenshot("outcomes-page.png", {
    animations: "disabled",
    fullPage: true,
  });
});

test("@visual outcome lightbox baseline", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1024");

  await page.goto("./outcomes");
  await page
    .getByRole("button", { name: "查看第 1 张：现场寻访" })
    .click();
  await expect(page.getByRole("dialog")).toHaveScreenshot(
    "outcome-lightbox.png",
    {
      animations: "disabled",
    },
  );
});
