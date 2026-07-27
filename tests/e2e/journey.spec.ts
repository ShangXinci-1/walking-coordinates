import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://webapi.amap.com/**", (route) => route.abort());
});

test("route and site selections are restored from shareable query parameters", async ({
  page,
}) => {
  await page.goto("./journey?route=war&site=lugou-bridge");

  await expect(page).toHaveURL(/route=war&site=lugou-bridge/);
  await expect(
    page.getByRole("heading", { level: 2, name: "卢沟桥" }),
  ).toBeVisible();
  await expect(
    page.getByRole("tab", { name: /烽火之路/ }),
  ).toHaveAttribute("aria-selected", "true");

  await page.getByRole("tab", { name: /进京之路/ }).click();
  await expect(page).toHaveURL(
    /route=capital&site=xiangshan-revolutionary-site/,
  );
  await expect(
    page.getByRole("heading", { level: 2, name: "香山革命纪念地" }),
  ).toBeVisible();

  await page
    .getByRole("navigation", { name: "当前路线地点" })
    .getByRole("button", { name: /清华园车站旧址/ })
    .click();
  await expect(page).toHaveURL(/route=capital&site=qinghuayuan-station/);
  await expect(
    page.getByRole("heading", { level: 2, name: "清华园车站旧址" }),
  ).toBeVisible();
});

test("invalid and mismatched query parameters are canonicalized", async ({
  page,
}) => {
  await page.goto("./journey?route=awakening&site=lugou-bridge");
  await expect(page).toHaveURL(/route=war&site=lugou-bridge/);

  await page.goto("./journey?route=unknown&site=unknown");
  await expect(page).toHaveURL(/route=awakening&site=beida-honglou/);
  await expect(
    page.getByRole("heading", { level: 2, name: "北大红楼" }),
  ).toBeVisible();
});

test("previous, next, browser history, and copy-link actions preserve archive state", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("./journey?route=awakening&site=beida-honglou");

  const pager = page.getByRole("navigation", { name: "相邻地点" });
  await expect(pager.getByRole("button", { name: /上一地点/ })).toBeDisabled();
  await pager.getByRole("button", { name: /下一地点/ }).click();
  await expect(page).toHaveURL(
    /route=awakening&site=new-youth-editorial-office/,
  );

  await pager.getByRole("button", { name: /下一地点/ }).click();
  await expect(page).toHaveURL(/route=awakening&site=li-dazhao-residence/);

  await page.goBack();
  await expect(page).toHaveURL(
    /route=awakening&site=new-youth-editorial-office/,
  );
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "《新青年》编辑部旧址",
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "复制当前档案链接" }).click();
  await expect(page.getByRole("button", { name: "链接已复制" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(
    "site=new-youth-editorial-office",
  );
});

test("route tabs and site list support directional keyboard navigation", async ({
  page,
}) => {
  await page.goto("./journey?route=awakening&site=beida-honglou");

  const activeRoute = page.getByRole("tab", { name: /觉醒之路/ });
  await activeRoute.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/route=war&site=war-sculpture-park/);
  await expect(page.getByRole("tab", { name: /烽火之路/ })).toBeFocused();

  const activeSite = page
    .getByRole("navigation", { name: "当前路线地点" })
    .getByRole("button", { name: /中国人民抗日战争纪念雕塑园/ });
  await activeSite.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page).toHaveURL(/route=war&site=lugou-bridge/);
  await expect(
    page
      .getByRole("navigation", { name: "当前路线地点" })
      .getByRole("button", { name: /卢沟桥/ }),
  ).toBeFocused();
});

test("mobile selection prioritizes and focuses the current dossier", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-375");
  await page.goto("./journey?route=capital&site=xiangshan-revolutionary-site");

  await page
    .getByRole("navigation", { name: "当前路线地点" })
    .getByRole("button", { name: /中国共产党历史展览馆/ })
    .click();

  const title = page.getByRole("heading", {
    level: 2,
    name: "中国共产党历史展览馆",
  });
  await expect(title).toBeFocused();
  await expect(title).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "展开在线地图" }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("AMap failure leaves a blank map while the archive remains usable", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440");
  await page.goto("./journey?route=war&site=lugou-bridge");

  const map = page.getByTestId("amap-route-map");
  await expect(map).toHaveAttribute("data-map-status", "blank");
  await expect(map.locator(".amap-route-map__canvas")).toBeEmpty();
  await expect(page.getByText(/地图.*失败|加载.*错误/)).toHaveCount(0);

  await page
    .getByRole("navigation", { name: "当前路线地点" })
    .getByRole("button", { name: /宛平城/ })
    .click();
  await expect(
    page.getByRole("heading", { level: 2, name: "宛平城" }),
  ).toBeVisible();
});

test("journey page never overflows the configured viewport", async ({ page }) => {
  await page.goto("./journey?route=awakening&site=beida-honglou");

  await expect
    .poll(() =>
      page.evaluate(() => ({
        viewport: window.innerWidth,
        page: document.documentElement.scrollWidth,
      })),
    )
    .toEqual(
      await page.evaluate(() => ({
        viewport: window.innerWidth,
        page: window.innerWidth,
      })),
    );
});

test("@visual journey archive baseline", async ({ page }) => {
  await page.goto("./journey?route=awakening&site=beida-honglou");
  await expect(page).toHaveScreenshot("journey-page.png", {
    animations: "disabled",
    fullPage: true,
  });
});
