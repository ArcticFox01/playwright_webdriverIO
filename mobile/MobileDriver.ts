import { remote } from "webdriverio";
import dotenv from "dotenv";

dotenv.config();

export class MobileDriver {
  driver!: any;

  async start() {
    const appiumHost = process.env.APPIUM_HOST || "127.0.0.1";
    const appiumPort = parseInt(process.env.APPIUM_PORT || "4723");
    const appiumPath = process.env.APPIUM_PATH || "/";

    this.driver = await remote({
      hostname: appiumHost,
      port: appiumPort,
      path: appiumPath,
      capabilities: {
        platformName: process.env.APPIUM_PLATFORM_NAME,
        "appium:deviceName": process.env.APPIUM_DEVICE_NAME,
        "appium:platformVersion": process.env.APPIUM_PLATFORM_VERSION,
        "appium:automationName": process.env.APPIUM_AUTOMATION_NAME,
        "appium:bundleId": process.env.APPIUM_BUNDLE_ID,
        "appium:udid": process.env.APPIUM_UDID,
        "appium:app": process.env.APPIUM_APP_PATH,
      },
    });
  }

  async stop() {
    await this.driver.deleteSession();
  }
}
