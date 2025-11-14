"use client";

import { notifications } from "@mantine/notifications";
import { useMutation } from "@tanstack/react-query";
import { downloadBookingConfirmationAction } from "../actions";

export function useDownloadBookingConfirmation() {
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async (gmt_no: string) => {
            const result = await downloadBookingConfirmationAction({ gmt_no });
            return result;
        },
    });

    const downloadConfirmation = (gmt_no: string) => {
        notifications.show({
            title: "Preparing download",
            message: "Please wait while we prepare your download",
            loading: true,
            id: "download-booking-confirmation",
            autoClose: false,
        });
        mutateAsync(gmt_no)
            .then(async (result) => {
                // Access the data from SafeActionResult
                if (result?.data?.url) {
                    const url = result.data.url;

                    // Log the URL for testing/debugging
                    console.log("Download Booking Confirmation URL:", url);

                    // Open the presigned URL directly - presigned URLs work fine when opened in browser
                    // Note: HEAD requests are blocked by CORS, but direct navigation works
                    window.open(url, "_blank");
                    notifications.update({
                        id: "download-booking-confirmation",
                        title: "Success",
                        message: "Download started",
                        color: "green",
                        loading: false,
                        autoClose: 2000,
                    });
                } else {
                    throw new Error("No download URL received");
                }
            })
            .catch((error) => {
                notifications.update({
                    id: "download-booking-confirmation",
                    title: "Error",
                    message: error instanceof Error ? error.message : "Failed to download booking confirmation",
                    color: "red",
                    loading: false,
                    autoClose: 5000,
                });
            });
    };

    return { downloadConfirmation, isPending };
}

