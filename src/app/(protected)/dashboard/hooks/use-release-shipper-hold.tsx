"use client";

import { notifications } from "@mantine/notifications";
import { closeAllModals, openConfirmModal } from "@mantine/modals";
import { releaseShipperHoldAction } from "../actions";
import { Text } from "@mantine/core";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ShipmentData = {
  gmt_no: string;
  portOfLoading: string;
  portOfDischarge: string;
  vesselName: string;
};

export function useReleaseShipperHold() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      gmt_no,
      portOfLoading,
      portOfDischarge,
      vesselName,
    }: ShipmentData) => {
      const result = await releaseShipperHoldAction({
        gmt_no,
        portOfLoading,
        portOfDischarge,
        vesselName,
        holdRemovedAt: dayjs().format("MMMM D, YYYY [at] h:mm A"),
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
        id: "release-shipper-hold",
        title: "Success",
        message: "Shipper hold released",
        color: "green",
        loading: false,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      notifications.update({
        id: "release-shipper-hold",
        title: "Error",
        message: error.message,
        color: "red",
        loading: false,
        autoClose: 2000,
      });
    },
  });

  const releaseHold = ({
    gmt_no,
    portOfLoading,
    portOfDischarge,
    vesselName,
  }: ShipmentData) => {
    openConfirmModal({
      title: "Release Shipper Hold",
      children: <Text>Are you sure you want to release the shipper hold?</Text>,
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
          title: "Releasing shipper hold",
          message: "Please wait while we release the shipper hold",
          loading: true,
          id: "release-shipper-hold",
          autoClose: false,
        });
        void mutateAsync({
          gmt_no,
          portOfLoading,
          portOfDischarge,
          vesselName,
        });
      },
    });
  };

  return { releaseHold };
}
