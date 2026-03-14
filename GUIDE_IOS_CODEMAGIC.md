# iOS 云端打包与发布指南 (Codemagic + TestFlight)

本指南将协助您完成从 Apple 开发者账号申请到使用 Codemagic 实现自动化发布的完整流程。

## 目录
1. [前期准备：Apple 开发者账号](#1-前期准备apple-开发者账号)
2. [本地配置](#2-本地配置)
3. [证书与描述文件准备](#3-证书与描述文件准备)
4. [App Store Connect 配置](#4-app-store-connect-配置)
5. [Codemagic 配置](#5-codemagic-配置)
6. [触发构建与发布](#6-触发构建与发布)

---

## 1. 前期准备：Apple 开发者账号

### 1.1 注册账号
如果您还没有账号，请前往 [Apple Developer Program](https://developer.apple.com/programs/) 注册并支付年费（$99 USD）。

### 1.2 创建 App ID (Bundle ID)
1. 登录 [Apple Developer Portal](https://developer.apple.com/account)。
2. 导航至 **Certificates, Identifiers & Profiles** > **Identifiers**。
3. 点击 `+` 创建新的 **App IDs**。
4. **Description**: 填写 `CloudSet`。
5. **Bundle ID**: 选择 **Explicit**，填写 `com.yourname.cloudprou`（请替换为您自己的域名反写，**务必记下此 ID**）。
6. 勾选需要的 Capabilities（本项目通常不需要特殊权限，默认即可）。
7. 点击 **Register** 完成注册。

---

## 2. 本地配置

在将代码推送到仓库前，必须确保本地配置与 Apple Developer 中的 Bundle ID 一致。

### 2.1 修改 `capacitor.config.ts`
打开项目根目录下的 `capacitor.config.ts`，修改 `appId`：

```typescript
const config: CapacitorConfig = {
  appId: 'com.yourname.cloudprou', // 替换为您刚才申请的 Bundle ID
  appName: '云集控',
  webDir: 'dist'
};
```

### 2.2 修改 Info.plist 权限 (生物识别)
在 `ios/App/App/Info.plist` 中，已自动添加了 Face ID 权限描述。如果需要修改提示语，请编辑该文件：

```xml
<key>NSFaceIDUsageDescription</key>
<string>我们需要使用面容 ID 来验证您的身份以保护资产安全</string>
```

### 2.3 同步原生项目
执行以下命令将配置应用到 iOS 项目：

```bash
npm run build
npx cap sync ios
```

---

## 3. 证书与描述文件准备

为了让 Codemagic 能打包并签名应用，您需要导出以下文件。

### 3.1 创建发布证书 (Distribution Certificate)
1. 在 Apple Developer Portal 中，进入 **Certificates**，点击 `+`。
2. 选择 **iOS Distribution (App Store and Ad Hoc)**。
3. 上传 **CSR 文件**（在 Mac 上使用“钥匙串访问” > 证书助理 > 从证书颁发机构请求证书 生成）。
4. 下载生成的 `.cer` 文件并双击导入钥匙串。

### 3.2 导出 P12 证书文件
1. 打开 Mac 的“钥匙串访问”。
2. 找到刚才导入的证书（名称通常为 `iPhone Distribution: ...`）。
3. 展开证书，同时选中证书和专用密钥。
4. 右键点击，选择 **导出 2 个项目**。
5. 保存为 `.p12` 文件格式。
6. **设置一个强密码**（**重要：记下这个密码**，后续 Codemagic 需要用到）。

### 3.3 创建描述文件 (Provisioning Profile)
1. 在 Apple Developer Portal 中，进入 **Profiles**，点击 `+`。
2. 选择 **Distribution** > **App Store**。
3. 选择您创建的 **App ID**。
4. 选择您刚才创建的 **发布证书**。
5. Profile Name 建议填写 `CloudSet App Store Profile`。
6. 下载 `.mobileprovision` 文件。

---

## 4. App Store Connect 配置

### 4.1 创建应用记录
1. 登录 [App Store Connect](https://appstoreconnect.apple.com/)。
2. 进入 **My Apps**，点击 `+` > **New App**。
3. **Bundle ID**: 选择您创建的 `com.yourname.cloudprou`。
4. **SKU**: 填写唯一标识（如 `cloudset-ios-001`）。
5. 创建成功后，在 **App Information** 页面找到 **Apple ID**（一串纯数字，如 `6451234567`），**记下它**。

### 4.2 生成 API Key (用于自动化上传)
1. 进入 **Users and Access** > **Integrations** > **App Store Connect API**。
2. 点击 `+` 生成 Key。
3. **Name**: `Codemagic Upload`。
4. **Access**: 选择 `App Manager`。
5. 下载 `.p8` 私钥文件（**注意：只能下载一次，请妥善保存**）。
6. 记录下 **Issuer ID** 和 **Key ID**。

---

## 5. Codemagic 配置

### 5.1 修改 `codemagic.yaml`
打开项目根目录下的 `codemagic.yaml`，修改 `vars` 部分：

```yaml
vars:
  XCODE_WORKSPACE: "ios/App/App.xcworkspace"
  XCODE_SCHEME: "App"
  BUNDLE_ID: "com.yourname.cloudprou" # 替换为您真实的 Bundle ID
  APP_STORE_ID: "1234567890"          # 替换为您真实的 Apple ID (纯数字)
```

### 5.2 配置 Codemagic 环境变量
1. 登录 [Codemagic](https://codemagic.io/)，添加您的仓库并选择 **iOS App**。
2. 进入应用的 **Environment variables** 页面，添加以下变量（注意勾选 **Secure**）：

#### 组名：`app_store_credentials`
| 变量名 | 值 | 说明 |
| :--- | :--- | :--- |
| `APP_STORE_CONNECT_ISSUER_ID` | (从 App Store Connect 获取) | API Key 的 Issuer ID |
| `APP_STORE_CONNECT_KEY_IDENTIFIER` | (从 App Store Connect 获取) | API Key 的 Key ID |
| `APP_STORE_CONNECT_PRIVATE_KEY` | (粘贴 .p8 文件内容) | API Key 私钥内容 |

#### 组名：`ios_signing`
| 变量名 | 值 | 说明 |
| :--- | :--- | :--- |
| `CERTIFICATE_PRIVATE_KEY` | (上传 .p12 文件) | 导出的发布证书 |
| `CERTIFICATE_PASSWORD` | (您的密码) | 导出 .p12 时设置的密码 |
| `PROVISIONING_PROFILE` | (上传 .mobileprovision 文件) | 下载的描述文件 |

---

## 6. 触发构建与发布

1. 将所有代码（包括修改后的 `codemagic.yaml`）推送到 Git 仓库。
2. 在 Codemagic 界面点击 **Start new build**。
3. 选择工作流：`iOS Release`。
4. 点击 **Start build**。

### 构建成功后
* Codemagic 会自动打包 `.ipa` 文件。
* 自动上传到 App Store Connect 的 **TestFlight**。
* 您（及内部测试员）会收到 TestFlight 的邮件通知，即可通过 TestFlight App 安装测试。
