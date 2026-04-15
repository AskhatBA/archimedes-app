/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  DeviceListResponse,
  NotificationListResponse,
  RegisterDeviceBody,
  RegisterDeviceResponse,
  SendNotificationBody,
  SuccessResponse,
} from './data-contracts';

export namespace Notifications {
  /**
   * No description
   * @tags Notifications
   * @name DevicesCreate
   * @summary Register a device for push notifications
   * @request POST:/notifications/devices
   * @secure
   * @response `201` `RegisterDeviceResponse` Device registered successfully
   * @response `400` `void` Invalid request body
   * @response `401` `void` Unauthorized
   */
  export namespace DevicesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RegisterDeviceBody;
    export type RequestHeaders = {};
    export type ResponseBody = RegisterDeviceResponse;
  }

  /**
   * No description
   * @tags Notifications
   * @name DevicesList
   * @summary Get all registered devices for the authenticated user
   * @request GET:/notifications/devices
   * @secure
   * @response `200` `DeviceListResponse` List of registered devices
   * @response `401` `void` Unauthorized
   */
  export namespace DevicesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeviceListResponse;
  }

  /**
   * No description
   * @tags Notifications
   * @name DevicesDelete
   * @summary Unregister a device from push notifications
   * @request DELETE:/notifications/devices/{deviceId}
   * @secure
   * @response `200` `SuccessResponse` Device unregistered successfully
   * @response `400` `void` Invalid device ID
   * @response `401` `void` Unauthorized
   */
  export namespace DevicesDelete {
    export type RequestParams = {
      /** Device ID to unregister */
      deviceId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SuccessResponse;
  }

  /**
   * No description
   * @tags Notifications
   * @name SendCreate
   * @summary Send a push notification to a user
   * @request POST:/notifications/send
   * @secure
   * @response `200` `SuccessResponse` Notification sent successfully
   * @response `400` `void` Invalid request body
   * @response `401` `void` Unauthorized
   */
  export namespace SendCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SendNotificationBody;
    export type RequestHeaders = {};
    export type ResponseBody = SuccessResponse;
  }

  /**
   * No description
   * @tags Notifications
   * @name NotificationsList
   * @summary Get notification history for authenticated user
   * @request GET:/notifications
   * @secure
   * @response `200` `NotificationListResponse` List of notifications
   * @response `401` `void` Unauthorized
   */
  export namespace NotificationsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Number of notifications to return
       * @default 50
       */
      limit?: number;
      /**
       * Number of notifications to skip
       * @default 0
       */
      offset?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificationListResponse;
  }

  /**
   * No description
   * @tags Notifications
   * @name ReadPartialUpdate
   * @summary Mark a notification as read
   * @request PATCH:/notifications/{notificationId}/read
   * @secure
   * @response `200` `SuccessResponse` Notification marked as read
   * @response `401` `void` Unauthorized
   * @response `404` `void` Notification not found
   */
  export namespace ReadPartialUpdate {
    export type RequestParams = {
      /**
       * Notification ID to mark as read
       * @format uuid
       */
      notificationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SuccessResponse;
  }

  /**
   * No description
   * @tags Notifications
   * @name ReadAllPartialUpdate
   * @summary Mark all notifications as read
   * @request PATCH:/notifications/read-all
   * @secure
   * @response `200` `SuccessResponse` All notifications marked as read
   * @response `401` `void` Unauthorized
   */
  export namespace ReadAllPartialUpdate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SuccessResponse;
  }

  /**
 * No description
 * @tags Notifications
 * @name UnreadCountList
 * @summary Get unread notification count
 * @request GET:/notifications/unread-count
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    data?: {
  \** @example 5 *\
    count?: number,

},

}` Unread notification count
 * @response `401` `void` Unauthorized
*/
  export namespace UnreadCountList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      data?: {
        /** @example 5 */
        count?: number;
      };
    };
  }
}
