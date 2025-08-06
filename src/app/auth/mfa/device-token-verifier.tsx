"use client";

import { useEffect } from "react";
import { verifyDeviceTokenAction } from "./verify-device-token";

export default function DeviceTokenVerifier({
  pendingUserId,
}: {
  pendingUserId: string;
}) {
  useEffect(() => {
    const verifyToken = async () => {
      await verifyDeviceTokenAction({ pendingUserId });
    };
    verifyToken();
  }, [pendingUserId]);

  return null;
}