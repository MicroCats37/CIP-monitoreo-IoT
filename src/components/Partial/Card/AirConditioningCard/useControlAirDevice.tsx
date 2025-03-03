import { useMutation } from "@tanstack/react-query";
import { controlAirDevice } from "@/utils/AirApiUtils/apiClient";
import { ControlDeviceBody, ControlDeviceResponse } from "@/utils/AirApiUtils/types";

export function useControlAirDevice() {
  return useMutation<ControlDeviceResponse, Error, ControlDeviceBody>({
    mutationFn: controlAirDevice,
  });
}
