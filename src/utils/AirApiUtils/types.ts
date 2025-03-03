export type ControlDeviceBody = {
    controller: string;
    devid: string;
    run?: string;
    mode?: string;
    wind?: string;
    temp?: string;
  };
  
  export type ControlDeviceResponse = {
    success: boolean;
    response: string;
  };