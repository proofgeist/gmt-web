"use client";

import {
  Box,
  Combobox,
  Grid,
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
  getCountryCallingCode,
  isSupportedCountry,
} from "libphonenumber-js";
import { useEffect, useState } from "react";
import en from "react-phone-number-input/locale/en";
import flags from "react-phone-number-input/flags";

// Get country data
const countries = Object.entries(en)
  .filter(([country]) => isSupportedCountry(country))
  .map(([country, label]) => ({
    value: country,
    label: `${label} (+${getCountryCallingCode(country as CountryCode)})`,
    code: getCountryCallingCode(country as CountryCode),
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
  const [selectedCountry, setSelectedCountry] =
    useState<CountryCode>(defaultCountry);
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      setSearch("");
    },
  });

  const handlePhoneChange = (value: string) => {
    // Always ensure there's a + at the start
    const normalizedValue =
      value.startsWith("+") ? value : `+${value.replace(/^\+*/g, "")}`;
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

  const CountryFlag = flags[selectedCountry];
  console.log(CountryFlag);

  return (
    <Box>
      <Text size="sm" fw={500}>
        {label}
      </Text>
      <Stack gap="xs">
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
              disabled={disabled}
              w="100%"
            >
              {countries.find((item) => item.value === selectedCountry)
                ?.label || "Select country"}
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
                    {selectedCountry === item.value ?
                      <Group gap="xs" wrap="nowrap">
                        <IconCheck size={16} />
                        <Text>{item.label}</Text>
                      </Group>
                    : <Text>{item.label}</Text>}
                  </Combobox.Option>
                ))}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
        <Grid align="center" gutter="xs">
          <Grid.Col span="content">
            {CountryFlag && (
              <Box w={50} ml={1} style={{ display: "flex", alignItems: "center", height: "100%", borderRadius: "4px", overflow: "hidden" }}>
                <CountryFlag
                  title={
                    countries.find((c) => c.value === selectedCountry)?.label ||
                    selectedCountry
                  }
                />
              </Box>
            )}
          </Grid.Col>
          <Grid.Col span="auto">
            <TextInput
              placeholder="234 555 6789"
              required={required}
              withAsterisk={false}
              value={value?.replace(/^\+\d+\s*/, "") ?? ""}
              onChange={(e) => {
                const countryCode = value?.match(/^\+(\d+)/)?.[1];
                handlePhoneChange(
                  countryCode ?
                    `+${countryCode} ${e.target.value}`
                  : e.target.value
                );
              }}
              w="100%"
              error={error}
              disabled={disabled}
            />
          </Grid.Col>
        </Grid>
      </Stack>
    </Box>
  );
}
