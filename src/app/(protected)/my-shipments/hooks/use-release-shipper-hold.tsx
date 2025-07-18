"use client";

import { showNotification } from "@mantine/notifications";
import { openConfirmModal } from "@mantine/modals";
import { releaseShipperHoldAction } from "../actions";
import { Text } from "@mantine/core";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";

type ShipmentData = {
  gmt_no: string;
  portOfLoading: string;
  portOfDischarge: string;
  vesselName: string;
};

export function useReleaseShipperHold() {
  const queryClient = useQueryClient();

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
      },
      labels: {
        confirm: "Confirm",
        cancel: "Cancel",
      },
      onConfirm: () => {
        void (async () => {
          try {
            await releaseShipperHoldAction({
              gmt_no,
              portOfLoading,
              portOfDischarge,
              vesselName,
              holdRemovedAt: dayjs().format("MMMM D, YYYY [at] h:mm A"),
            });
            await queryClient.invalidateQueries();

            showNotification({
              title: "Success",
              message: "Shipper hold released",
              color: "green",
            });
          } catch (error) {
            showNotification({
              title: "Error",
              message:
                error instanceof Error ?
                  error.message
                : "An unknown error occurred",
              color: "red",
            });
          }
        })();
      },
    });
  };

  return { releaseHold };
}
