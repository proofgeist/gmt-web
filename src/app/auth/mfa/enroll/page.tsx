import { Container, Skeleton, Text, Title } from "@mantine/core";
import MFAEnrollForm from "./mfa-enroll-form";
import { Suspense } from "react";
import { getCountries, CountryCode } from "libphonenumber-js";

export default async function Page() {
  // Server-side geolocation for initial phone prefix
  let userCountryCode: CountryCode | undefined = undefined;
  try {
    const res = await fetch("https://ipapi.co/json/", {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      type IpApiResponse = { country_code?: string };
      const data: IpApiResponse = await res.json();
      const countryCode = data.country_code;
      if (
        typeof countryCode === "string" &&
        getCountries().includes(countryCode as CountryCode)
      ) {
        userCountryCode = countryCode as CountryCode;
      }
    }
  } catch {
    // fallback: leave initialPhonePrefix as empty string
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Set Up Two-Factor Authentication</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter your phone number to enable two-factor authentication.
      </Text>

      <Suspense fallback={<Skeleton height={400} />}>
        <MFAEnrollForm userCountryCode={userCountryCode} />
      </Suspense>
    </Container>
  );
}
