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
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Notifications<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Notifications
   * @name DevicesCreate
   * @summary Register a device for push notifications
   * @request POST:/notifications/devices
   * @secure
   * @response `201` `RegisterDeviceResponse` Device registered successfully
   * @response `400` `void` Invalid request body
   * @response `401` `void` Unauthorized
   */
  devicesCreate = (data: RegisterDeviceBody, params: RequestParams = {}) =>
    this.request<RegisterDeviceResponse, void>({
      path: `/notifications/devices`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Notifications
   * @name DevicesList
   * @summary Get all registered devices for the authenticated user
   * @request GET:/notifications/devices
   * @secure
   * @response `200` `DeviceListResponse` List of registered devices
   * @response `401` `void` Unauthorized
   */
  devicesList = (params: RequestParams = {}) =>
    this.request<DeviceListResponse, void>({
      path: `/notifications/devices`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Notifications
   * @name DevicesDelete
   * @summary Unregister a device from push notifications
   * @request DELETE:/notifications/devices/{deviceId}
   * @secure
   * @response `200` `SuccessResponse` Device unregistered successfully
   * @response `400` `void` Invalid device ID
   * @response `401` `void` Unauthorized
   */
  devicesDelete = (deviceId: string, params: RequestParams = {}) =>
    this.request<SuccessResponse, void>({
      path: `/notifications/devices/${deviceId}`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Notifications
   * @name SendCreate
   * @summary Send a push notification to a user
   * @request POST:/notifications/send
   * @secure
   * @response `200` `SuccessResponse` Notification sent successfully
   * @response `400` `void` Invalid request body
   * @response `401` `void` Unauthorized
   */
  sendCreate = (data: SendNotificationBody, params: RequestParams = {}) =>
    this.request<SuccessResponse, void>({
      path: `/notifications/send`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Notifications
   * @name NotificationsList
   * @summary Get notification history for authenticated user
   * @request GET:/notifications
   * @secure
   * @response `200` `NotificationListResponse` List of notifications
   * @response `401` `void` Unauthorized
   */
  notificationsList = (
    query?: {
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
    },
    params: RequestParams = {},
  ) =>
    this.request<NotificationListResponse, void>({
      path: `/notifications`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Notifications
   * @name ReadPartialUpdate
   * @summary Mark a notification as read
   * @request PATCH:/notifications/{notificationId}/read
   * @secure
   * @response `200` `SuccessResponse` Notification marked as read
   * @response `401` `void` Unauthorized
   * @response `404` `void` Notification not found
   */
  readPartialUpdate = (notificationId: string, params: RequestParams = {}) =>
    this.request<SuccessResponse, void>({
      path: `/notifications/${notificationId}/read`,
      method: 'PATCH',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Notifications
   * @name ReadAllPartialUpdate
   * @summary Mark all notifications as read
   * @request PATCH:/notifications/read-all
   * @secure
   * @response `200` `SuccessResponse` All notifications marked as read
   * @response `401` `void` Unauthorized
   */
  readAllPartialUpdate = (params: RequestParams = {}) =>
    this.request<SuccessResponse, void>({
      path: `/notifications/read-all`,
      method: 'PATCH',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  unreadCountList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        data?: {
          /** @example 5 */
          count?: number;
        };
      },
      void
    >({
      path: `/notifications/unread-count`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
}
