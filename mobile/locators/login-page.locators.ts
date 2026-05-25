export const LoginPageLocators = {
  appLogo: "app_logo",
  appTitle: "app_title",
  appSubtitle: "app_subtitle",
  usernameLabel: "username_label",
  usernameField: "login_username_field",
  passwordLabel: "password_label",
  passwordField: "login_password_field",
  loginButton: "login_button",

  // Error popup
  errorPopup: '//XCUIElementTypeAlert[@name="Login Error"]',
  errorHeader: '//XCUIElementTypeStaticText[@name="Login Error"]',
  errorText: '//XCUIElementTypeStaticText[@name="Invalid credentials"]',
  okButton: '//XCUIElementTypeButton[@name="OK"]',
};
