import { getCurrentSession } from "@/server/auth/utils/session";
import { Anchor, Container, Skeleton, Text, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import SignupForm from "./signup-form";
import { getRedirectCookie } from "@/server/auth/utils/redirect";
import { Suspense } from "react";
import {
  getCountries,
  getCountryCallingCode,
  CountryCode,
} from "libphonenumber-js";

export default async function Page() {
  const { session } = await getCurrentSession();

  if (session !== null) {
    const redirectTo = await getRedirectCookie();
    return redirect(redirectTo);
  }

  // Server-side geolocation
  let initialPhonePrefix = "";
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
        initialPhonePrefix = `+${getCountryCallingCode(countryCode as CountryCode)}`;
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
        <SignupForm initialPhonePrefix={initialPhonePrefix} />
      </Suspense>
    </Container>
  );
}
