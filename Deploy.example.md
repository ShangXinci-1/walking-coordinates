# 《行走的坐标》高德地图代理部署示例

> 此文件只提供无秘密的配置模板。实际域名、配置路径、Key 和 `securityJsCode` 写入被 `.gitignore` 忽略的 `Deploy.local.md`。

## 1. 凭据准备

### 1.1 Web 端凭据

#### 1.1.1 用途

在高德开放平台创建“Web 端（JS API）Key”，并取得配套 `securityJsCode`。JS API Key 可以进入前端构建；`securityJsCode` 只能写在服务器配置中。

### 1.2 Web 服务凭据

#### 1.2.1 用途

另行创建“Web 服务 Key”，供本地地理编码脚本使用。该 Key 只写入 `.env.local` 或本地环境变量，不进入前端代码。

## 2. Nginx 增量配置

### 2.1 `http` 级配置

#### 2.1.1 请求限速

下面的 `limit_req_zone` 必须放在 Nginx `http {}` 内，不能放在 `server {}` 内：

```nginx
limit_req_zone $binary_remote_addr zone=amap_proxy_limit:10m rate=10r/s;
```

### 2.2 `server` 级配置

#### 2.2.1 代理位置

将以下配置放入负责地图代理域名的 HTTPS `server {}` 中：

```nginx
# 仅在使用高德自定义地图样式时需要。
location /_AMapService/v4/map/styles {
    limit_req zone=amap_proxy_limit burst=20 nodelay;

    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin "https://<正式前端域名>" always;
        add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
        add_header Access-Control-Max-Age 86400 always;
        return 204;
    }

    add_header Access-Control-Allow-Origin "https://<正式前端域名>" always;
    add_header Vary "Origin" always;

    set $args "$args&jscode=<高德 securityJsCode>";
    proxy_ssl_server_name on;
    proxy_set_header Host webapi.amap.com;
    proxy_pass https://webapi.amap.com/v4/map/styles;
}

# 高德 Web 服务代理。固定前缀 /_AMapService 不可改变。
location /_AMapService/ {
    limit_req zone=amap_proxy_limit burst=20 nodelay;

    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin "https://<正式前端域名>" always;
        add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type" always;
        add_header Access-Control-Max-Age 86400 always;
        return 204;
    }

    add_header Access-Control-Allow-Origin "https://<正式前端域名>" always;
    add_header Vary "Origin" always;

    set $args "$args&jscode=<高德 securityJsCode>";
    proxy_ssl_server_name on;
    proxy_set_header Host restapi.amap.com;
    proxy_pass https://restapi.amap.com/;
}
```

## 3. 前端环境

### 3.1 本地文件

#### 3.1.1 `.env.local`

从 `.env.local.example` 复制并填写：

```dotenv
NEXT_PUBLIC_AMAP_JS_KEY=<Web 端 JS API Key>
NEXT_PUBLIC_AMAP_SERVICE_HOST=https://<代理域名>/_AMapService
WC_AMAP_WEB_KEY=<Web 服务 Key>
```

前端通过以下设置使用安全代理：

```ts
window._AMapSecurityConfig = {
  serviceHost: process.env.NEXT_PUBLIC_AMAP_SERVICE_HOST,
};
```

## 4. 应用与验证

### 4.1 Nginx 检查

#### 4.1.1 应用配置

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4.2 代理检查

#### 4.2.1 预检请求

```bash
curl -i -X OPTIONS \
  -H "Origin: https://<正式前端域名>" \
  "https://<代理域名>/_AMapService/v3/config/district?keywords=北京"
```

通过标准：

- HTTP 状态为 `204`；
- `Access-Control-Allow-Origin` 等于正式前端 Origin；
- 响应不包含 `securityJsCode`。

#### 4.2.2 浏览器验证

通过标准：

- 路线页能够加载高德底图；
- 代理请求发往 `NEXT_PUBLIC_AMAP_SERVICE_HOST`；
- 前端源代码和网络 URL 中不出现 `securityJsCode`；
- 停止代理后地图区域保持空白，导航、路线列表和地点档案继续可用。

## 5. 回退

### 5.1 配置备份

#### 5.1.1 应用前

应用配置前复制现有 Nginx 配置并记录路径。不要覆盖唯一配置副本。

### 5.2 恢复

#### 5.2.1 代理异常

恢复上一份 Nginx 配置，运行 `nginx -t`，确认通过后重新加载。前端不依赖代理完成其他页面服务，因此代理回退期间只有地图区域保持空白。
