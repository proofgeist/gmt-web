"use client";

import { notifications } from "@mantine/notifications";
import { closeAllModals, openConfirmModal } from "@mantine/modals";
import { requestShipperHoldAction } from "../actions";
import { Text } from "@mantine/core";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ShipmentData = {
  gmt_no: string;
  portOfLoading: string;
  portOfDischarge: string;
  vesselName: string;
};

export function useRequestShipperHold() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      gmt_no,
      portOfLoading,
      portOfDischarge,
      vesselName,
    }: ShipmentData) => {
      const result = await requestShipperHoldAction({
        gmt_no,
        portOfLoading,
        portOfDischarge,
        vesselName,
      });
      return result;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["activeShipments"] }),
        queryClient.invalidateQueries({ queryKey: ["pendingShipments"] }),
        queryClient.invalidateQueries({ queryKey: ["pastShipments"] }),
        queryClient.invalidateQueries({ queryKey: ["shipmentData"] }),
      ]);
      closeAllModals();
      notifications.update({
        id: "request-shipper-hold",
        title: "Success",
        message: "Shipper hold requested",
        color: "green",
        loading: false,
        autoClose: 2000,
      });
    },
    onError: (error) => {
      notifications.update({
        id: "request-shipper-hold",
        title: "Error",
        message: error.message,
        color: "red",
        loading: false,
        autoClose: 2000,
      });
    },
  });

  const requestHold = ({
    gmt_no,
    portOfLoading,
    portOfDischarge,
    vesselName,
  }: ShipmentData) => {
    openConfirmModal({
      title: "Request Shipper Hold",
      children: <Text>Are you sure you want to request the shipper hold?</Text>,
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
          title: "Requesting shipper hold",
          message: "Please wait while we request the shipper hold",
          loading: true,
          id: "request-shipper-hold",
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

  return { requestHold };
}
