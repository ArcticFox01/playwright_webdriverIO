# Playwright + WebdriverIO + Appium Architecture

## Goal

Use:

- Playwright as test runner
- WebdriverIO as Appium client
- Appium for native mobile automation

This gives:

- Playwright fixtures
- Playwright reporters
- Parallel execution
- Native iOS/Android automation

---

# High Level Architecture

```txt
Playwright Test
    ↓
Fixture
    ↓
Mobile Wrapper
    ↓
WebdriverIO
    ↓
Appium
    ↓
iOS / Android App
```

---

# What is a Fixture?

A fixture is:

> Reusable setup/teardown object injected into tests.

Example:

```ts
test('example', async ({ page }) => {
})
```

`page` is a fixture.

Playwright:

1. creates it
2. injects it
3. cleans it up

Automatically.

---

# Why Fixtures Matter

Fixtures help manage:

- setup
- teardown
- isolation
- dependency injection
- reusable objects

Perfect for:

- mobile drivers
- API clients
- DB connections
- auth sessions
- mock servers

---

# Without Fixture

```ts
test('login', async () => {
  const driver = await remote(...)

  const button = await driver.$('~login')
  await button.click()

  await driver.deleteSession()
})
```

Repeated everywhere.

---

# With Fixture

```ts
test('login', async ({ mobile }) => {
  await mobile.click('login')
})
```

Much cleaner.

---

# Mobile Wrapper Architecture

```txt
tests/
 ├── login.spec.ts

mobile/
 ├── MobileDriver.ts
 ├── MobilePage.ts
 ├── fixtures.ts
 └── selectors.ts
```

---

# MobileDriver.ts

Responsible for creating Appium/WebdriverIO session.

```ts
import { remote, Browser } from 'webdriverio'

export class MobileDriver {
  driver!: Browser<'async'>

  async start() {
    this.driver = await remote({
      hostname: '127.0.0.1',
      port: 4723,
      path: '/',
      capabilities: {
        platformName: 'iOS',
        'appium:deviceName': 'iPhone 16',
        'appium:platformVersion': '18.0',
        'appium:automationName': 'XCUITest',
        'appium:app': '/apps/MyApp.app',
      },
    })
  }

  async stop() {
    await this.driver.deleteSession()
  }
}
```

---

# MobilePage.ts

Playwright-like abstraction layer.

```ts
import { Browser } from 'webdriverio'

export class MobilePage {
  constructor(private driver: Browser<'async'>) {}

  async click(id: string) {
    await this.driver.$(`~${id}`).click()
  }

  async fill(id: string, text: string) {
    const el = await this.driver.$(`~${id}`)
    await el.setValue(text)
  }

  async text(id: string) {
    const el = await this.driver.$(`~${id}`)
    return el.getText()
  }

  async visible(id: string) {
    const el = await this.driver.$(`~${id}`)
    return el.isDisplayed()
  }

  async waitFor(id: string, timeout = 10000) {
    const el = await this.driver.$(`~${id}`)
    await el.waitForDisplayed({ timeout })
  }
}
```

---

# Playwright Fixture Integration

```ts
import { test as base } from '@playwright/test'
import { MobileDriver } from './MobileDriver'
import { MobilePage } from './MobilePage'

export const test = base.extend<{
  mobile: MobilePage
}>({
  mobile: async ({}, use) => {
    const mobileDriver = new MobileDriver()

    await mobileDriver.start()

    const page = new MobilePage(mobileDriver.driver)

    await use(page)

    await mobileDriver.stop()
  },
})
```

---

# Example Test

```ts
import { expect } from '@playwright/test'
import { test } from '../mobile/fixtures'

test('user can login', async ({ mobile }) => {
  await mobile.fill('email_input', 'test@test.com')
  await mobile.fill('password_input', '123456')

  await mobile.click('login_button')

  await mobile.waitFor('home_title')

  expect(await mobile.text('home_title'))
    .toContain('Home')
})
```

---

# Fixture Lifecycle

```txt
Fixture setup
    ↓
Test receives object
    ↓
Test runs
    ↓
Fixture cleanup
```

---

# Understanding `use()`

```ts
mobile: async ({}, use) => {
  const mobile = createMobile()

  await use(mobile)

  await mobile.close()
}
```

Equivalent to:

```ts
beforeEach(async () => {})
test(...)
afterEach(async () => {})
```

But cleaner and composable.

---

# Test Scoped vs Worker Scoped

## Test Scoped

New fixture per test.

```txt
test1 → new session
test2 → new session
```

Best for:

- mobile drivers
- isolated state

---

## Worker Scoped

Shared across multiple tests.

```ts
{
  scope: 'worker'
}
```

Best for:

- emulator boot
- login reuse
- DB pools

---

# Advanced Improvements

You can later add:

- auto waits
- retries
- screenshots
- tracing
- accessibility selectors
- AI healing
- logging
- video recording

Without changing test code.

---

# Auto Wait Example

```ts
async click(id: string) {
  const el = await this.driver.$(`~${id}`)

  await el.waitForDisplayed()
  await el.waitForEnabled()

  await el.click()
}
```

Helps reduce flaky tests.

---

# Cross Platform Support

```ts
if (platform === 'ios') {
  return `~${id}`
}

return `android=new UiSelector().description("${id}")`
```

Makes tests reusable across:

- iOS
- Android

---

# Recommended Final Stack

```txt
Playwright Test
    → Test Runner
    → Fixtures
    → Reporting
    → Parallelism

WebdriverIO
    → Mobile client

Appium
    → Native automation

XCUITest / UiAutomator2
    → Device automation
```

---

# Important Note

Playwright itself does NOT support native iOS automation.

It supports:

- browsers
- mobile web
- emulation

For native apps you still need:

- Appium
- XCUITest
- Detox
- Maestro
- XCTest
