
import { Anchor, Container, Skeleton, Text, Title } from "@mantine/core";
import SignupForm from "./signup-form";
import { Suspense } from "react";
import { getCountries, CountryCode } from "libphonenumber-js";


export default async function Page() {

  // Server-side geolocation
  let userCountryCode: CountryCode | undefined = undefined;
  try {
    // Use a public IP geolocation API
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
      <Title ta="center">Create account</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component="a" href="/auth/login">
          Sign in
        </Anchor>
      </Text>

      <Suspense fallback={<Skeleton height={400} />}>
        <SignupForm userCountryCode={userCountryCode} />
      </Suspense>
    </Container>
  );
}
