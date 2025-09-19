"use client";

import { notifications } from "@mantine/notifications";
import { closeAllModals, openConfirmModal } from "@mantine/modals";
import { cancelShipperHoldRequestAction } from "../actions";
import { Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCancelShipperHoldRequest() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      gmt_no,
    }: {
      gmt_no: string;
    }) => {
      const result = await cancelShipperHoldRequestAction({
        gmt_no,
      });
      return result;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["activeShipments"] }),
        queryClient.invalidateQueries({ queryKey: ["pendingShipments"] }),
        queryClient.invalidateQueries({ queryKey: ["pastShipments"] }),
        queryClient.invalidateQueries({ queryKey: ["shipmentData"] }),
        queryClient.invalidateQueries({ queryKey: ["booking-detail"] }),
      ]);
      closeAllModals();
      notifications.update({
        id: "cancel-shipper-hold-request",
        title: "Success",
        message: "Shipper hold request cancelled",
        color: "green",
        loading: false,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      notifications.update({
        id: "cancel-shipper-hold-request",
        title: "Error",
        message: error.message,
        color: "red",
        loading: false,
        autoClose: 2000,
      });
    },
  });

  const cancelHoldRequest = ({
    gmt_no,
  }: {
    gmt_no: string;
  }) => {
    openConfirmModal({
      title: "Cancel Shipper Hold Request",
      children: <Text>Are you sure you want to cancel the shipper hold request?</Text>,
      confirmProps: {
        color: "red",
        loading: isPending,
      },
      labels: {
        confirm: "Confirm",
        cancel: "Cancel",
      },
      onConfirm: () => {
        notifications.show({
          title: "Cancelling shipper hold request",
          message: "Please wait while we cancel the shipper hold request",
          loading: true,
          id: "cancel-shipper-hold-request",
          autoClose: false,
        });
        void mutateAsync({
          gmt_no,
        });
      },
    });
  };

  return { cancelHoldRequest };
}
