import { render, screen, userEvent } from "@testing-library/react-native";
import { Text } from "react-native";

import { LanguageSwitch } from "@/components/language-switch";
import { LocaleProvider, useLocale } from "@/i18n/locale-context";

jest.mock("expo-haptics", () => ({ selectionAsync: jest.fn(async () => undefined) }));

jest.useFakeTimers();

test("switches locale and retains it in device storage", async () => {
  const storage = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  });

  function Probe() {
    const { locale } = useLocale();
    return <Text>{locale}</Text>;
  }

  const user = userEvent.setup();
  await render(
    <LocaleProvider>
      <LanguageSwitch />
      <Probe />
    </LocaleProvider>,
  );

  expect(screen.getByRole("radio", { name: "AZ" })).toBeChecked();
  await user.press(screen.getByRole("radio", { name: "RU" }));
  expect(screen.getByRole("radio", { name: "RU" })).toBeChecked();
  expect(storage.get("qiymetleri.locale")).toBe("ru");
});
