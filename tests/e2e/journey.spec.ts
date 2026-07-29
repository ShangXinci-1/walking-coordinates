import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://webapi.amap.com/**", (route) => route.abort());
});

async function installWheelAwareAMapStub(page: import("@playwright/test").Page) {
  await page.addInitScript({
    content: `
      (() => {
        class FakeMap {
          constructor(container, options) {
            this.container = container;
            this.handlers = new Map();
            this.zoom = options.zoom;
            this.zooms = [...options.zooms];
            const previousState = window.__amapTestState;
            window.__amapTestState = {
              initialZoom: options.zoom,
              initialZooms: options.zooms,
              zooms: this.zooms,
              currentZoom: this.zoom,
              mapCreateCount: (previousState?.mapCreateCount ?? 0) + 1,
              destroyCount: previousState?.destroyCount ?? 0,
              fitCallCount: 0,
              zoomAndCenterCallCount: 0,
              lastFitRoute: null,
              lastCameraImmediate: null,
              lastCameraDuration: null,
              markerCount: 0,
              polylineCount: 0,
              routePointCounts: [],
            };
            container.replaceChildren(document.createElement("div"));
            container.addEventListener("wheel", (event) => {
              event.preventDefault();
              this.zoom = Math.min(
                this.zooms[1],
                Math.max(
                  this.zooms[0],
                  this.zoom + (event.deltaY < 0 ? 1 : -1),
                ),
              );
              window.__amapTestState.currentZoom = this.zoom;
            }, { passive: false });
            setTimeout(() => this.handlers.get("complete")?.(), 0);
          }
          add(overlays) {
            const overlayList = Array.isArray(overlays) ? overlays : [overlays];
            overlayList.forEach((overlay) => {
              if (overlay.content) this.container.append(overlay.content);
            });
          }
          destroy() {
            window.__amapTestState.destroyCount += 1;
          }
          getFitZoomAndCenterByOverlays(overlays) {
            const routeId = overlays.find((overlay) => overlay.routeId)?.routeId;
            const fitViews = {
              awakening: [11.2, [116.38, 39.92]],
              war: [10.7, [116.3, 39.94]],
              capital: [11.4, [116.39, 39.99]],
            };
            const fitView = fitViews[routeId] ?? [10, [116.4074, 39.9042]];
            window.__amapTestState.fitCallCount += 1;
            window.__amapTestState.lastFitRoute = routeId;
            return fitView;
          }
          getZoom() { return this.zoom; }
          off(eventName, handler) {
            if (this.handlers.get(eventName) === handler) {
              this.handlers.delete(eventName);
            }
          }
          on(eventName, handler) { this.handlers.set(eventName, handler); }
          setZoomAndCenter(zoom, center, immediately, duration) {
            this.zoom = zoom;
            window.__amapTestState.currentZoom = zoom;
            window.__amapTestState.zoomAndCenterCallCount += 1;
            window.__amapTestState.lastCameraImmediate = immediately;
            window.__amapTestState.lastCameraDuration = duration;
          }
          setZooms(zooms) {
            this.zooms = [...zooms];
            window.__amapTestState.zooms = this.zooms;
          }
        }

        class FakeMarker {
          constructor(options) {
            this.content = options.content;
            this.routeId = options.content.dataset.routeId;
            window.__amapTestState.markerCount += 1;
          }
          on() {}
          setzIndex() {}
        }

        class FakePolyline {
          constructor(options) {
            window.__amapTestState.polylineCount += 1;
            window.__amapTestState.routePointCounts.push(options.path.length);
          }
          on() {}
          setOptions() {}
        }

        window.AMap = {
          Map: FakeMap,
          Marker: FakeMarker,
          Pixel: class FakePixel {},
          Polyline: FakePolyline,
        };
      })();
    `,
  });
}

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
  await installWheelAwareAMapStub(page);
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
  await expect(page.getByTestId("amap-route-map")).toHaveCount(0);

  await page.getByRole("button", { name: "展开在线地图" }).click();
  await expect(page.getByTestId("amap-route-map")).toBeVisible();
  await page.getByRole("button", { name: "收起在线地图" }).click();
  await expect(page.getByTestId("amap-route-map")).toBeHidden();
  await page.getByRole("button", { name: "展开在线地图" }).click();
  await expect(page.getByTestId("amap-route-map")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as typeof window & {
              __amapTestState?: { mapCreateCount: number };
            }
          ).__amapTestState?.mapCreateCount,
      ),
    )
    .toBe(1);
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

test("desktop map is horizontal and releases downward wheel scrolling at minimum zoom", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440");
  await installWheelAwareAMapStub(page);
  await page.goto("./journey?route=awakening&site=beida-honglou");

  const map = page.getByTestId("amap-route-map");
  await expect(map).toHaveAttribute("data-map-status", "ready");
  await expect(map).toHaveAttribute("data-map-min-zoom", "11.2");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as typeof window & {
              __amapTestState?: {
                initialZoom: number;
                initialZooms: number[];
                zooms: number[];
                currentZoom: number;
                mapCreateCount: number;
                destroyCount: number;
                fitCallCount: number;
                zoomAndCenterCallCount: number;
                lastFitRoute: string;
                lastCameraImmediate: boolean;
                lastCameraDuration: number;
                markerCount: number;
                polylineCount: number;
                routePointCounts: number[];
              };
            }
          ).__amapTestState,
      ),
    )
    .toMatchObject({
      initialZoom: 10,
      initialZooms: [2, 18],
      zooms: [11.2, 18],
      currentZoom: 11.2,
      mapCreateCount: 1,
      destroyCount: 0,
      fitCallCount: 1,
      zoomAndCenterCallCount: 1,
      lastFitRoute: "awakening",
      lastCameraImmediate: true,
      lastCameraDuration: 0,
      markerCount: 13,
      polylineCount: 3,
      routePointCounts: [5, 5, 3],
    });
  await expect(
    map.locator('.journey-map-marker[data-route-active="true"]'),
  ).toHaveCount(5);
  await expect(
    map.locator('.journey-map-marker[data-active="true"]'),
  ).toHaveCount(1);

  const mapBox = await map.boundingBox();
  expect(mapBox).not.toBeNull();
  expect(mapBox!.width / mapBox!.height).toBeGreaterThan(1.9);

  await map.scrollIntoViewIfNeeded();
  const visibleMapBox = await map.boundingBox();
  expect(visibleMapBox).not.toBeNull();
  await page.mouse.move(
    visibleMapBox!.x + visibleMapBox!.width / 2,
    visibleMapBox!.y + visibleMapBox!.height / 2,
  );
  const initialScrollY = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 640);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(initialScrollY);

  await page.getByRole("tab", { name: /烽火之路/ }).click();
  await expect(map).toHaveAttribute("data-map-min-zoom", "10.7");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as typeof window & {
              __amapTestState?: {
                mapCreateCount: number;
                destroyCount: number;
                fitCallCount: number;
                zoomAndCenterCallCount: number;
                lastFitRoute: string;
                lastCameraImmediate: boolean;
                lastCameraDuration: number;
              };
            }
          ).__amapTestState,
      ),
    )
    .toMatchObject({
      mapCreateCount: 1,
      destroyCount: 0,
      fitCallCount: 2,
      zoomAndCenterCallCount: 2,
      lastFitRoute: "war",
      lastCameraImmediate: false,
      lastCameraDuration: 480,
    });
  await expect(
    map.locator('.journey-map-marker[data-route-active="true"]'),
  ).toHaveCount(5);

  await page
    .getByRole("navigation", { name: "当前路线地点" })
    .getByRole("button", { name: /卢沟桥/ })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as typeof window & {
              __amapTestState?: {
                mapCreateCount: number;
                destroyCount: number;
                fitCallCount: number;
                zoomAndCenterCallCount: number;
              };
            }
          ).__amapTestState,
      ),
    )
    .toMatchObject({
      mapCreateCount: 1,
      destroyCount: 0,
      fitCallCount: 2,
      zoomAndCenterCallCount: 2,
    });
});

test("map route changes honor reduced-motion preferences", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installWheelAwareAMapStub(page);
  await page.goto("./journey?route=awakening&site=beida-honglou");

  await page.getByRole("tab", { name: /进京之路/ }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as typeof window & {
              __amapTestState?: {
                mapCreateCount: number;
                fitCallCount: number;
                lastFitRoute: string;
                lastCameraImmediate: boolean;
                lastCameraDuration: number;
              };
            }
          ).__amapTestState,
      ),
    )
    .toMatchObject({
      mapCreateCount: 1,
      fitCallCount: 2,
      lastFitRoute: "capital",
      lastCameraImmediate: true,
      lastCameraDuration: 0,
    });
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
