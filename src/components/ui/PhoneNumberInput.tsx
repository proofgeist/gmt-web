"use client";

import {
  Combobox,
  Group,
  InputBase,
  Stack,
  Text,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import {
  AsYouType,
  CountryCode,
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";
import { useEffect, useState } from "react";

// Get country data
const countries = getCountries()
  .map((country) => ({
    value: country,
    label: `${country} (+${getCountryCallingCode(country)})`,
    code: getCountryCallingCode(country),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  defaultCountry?: CountryCode;
  required?: boolean;
  label?: string;
  disabled?: boolean;
}

export function PhoneNumberInput({
  value,
  onChange,
  error,
  defaultCountry = "US",
  required = false,
  label = "Phone Number",
  disabled = false,
}: PhoneNumberInputProps) {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(defaultCountry);
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearch("");
    },
  });

  const handlePhoneChange = (value: string) => {
    // Always ensure there's a + at the start
    const normalizedValue = value.startsWith("+") ? value : `+${value.replace(/^\+*/g, "")}`;
    const formatter = new AsYouType();
    const formattedNumber = formatter.input(normalizedValue);
    onChange(formattedNumber);
  };

  // Initialize phone number with country code if empty
  useEffect(() => {
    if (!value) {
      const countryCode = getCountryCallingCode(selectedCountry);
      handlePhoneChange(`+${countryCode}`);
    }
  }, [selectedCountry, value]);

  return (
    <Group gap="xs" align="flex-start">
      <Stack gap={0}>
        <Text size="sm" fw={500}>{label}</Text>
        <Group gap="xs">

      <Combobox
        store={combobox}
        withinPortal={false}
        disabled={disabled}
        onOptionSubmit={(val) => {
          const country = countries.find((c) => c.value === val);
          if (country) {
            setSelectedCountry(val as CountryCode);
            const currentNumber = value || "";
            const numberWithoutCode = currentNumber.replace(/^\+\d+\s*/, "");
            handlePhoneChange(`+${country.code} ${numberWithoutCode}`);
          }
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            pointer
            rightSection={<Combobox.Chevron />}
            onClick={() => combobox.toggleDropdown()}
            rightSectionPointerEvents="none"
            w={140}
            disabled={disabled}
          >
            {countries.find((item) => item.value === selectedCountry)?.label ||
              "Select country"}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Search
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Combobox.Options mah={200} style={{ overflowY: "auto" }}>
            {countries
              .filter((item) =>
                item.label.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <Combobox.Option value={item.value} key={item.value}>
                  {selectedCountry === item.value ? (
                    <Group gap="xs" wrap="nowrap">
                      <IconCheck size={16} />
                      <Text>{item.label}</Text>
                    </Group>
                  ) : (
                    <Text>{item.label}</Text>
                  )}
                </Combobox.Option>
              ))}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>

      <TextInput
        placeholder="234 555 6789"
        required={required}
        withAsterisk={false}
        value={value?.replace(/^\+\d+\s*/, "") ?? ""}
        onChange={(e) => {
          const countryCode = value?.match(/^\+(\d+)/)?.[1];
          handlePhoneChange(
            countryCode ? `+${countryCode} ${e.target.value}` : e.target.value
          );
        }}
        error={error}
        style={{ flex: 1 }}
        disabled={disabled}
        />
        </Group>
        </Stack>
    </Group>
  );
}
