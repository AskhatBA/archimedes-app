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

import { Appointment, CreateAppointmentBody, UpdateAppointmentBody } from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Appointments<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * No description
 *
 * @tags Appointments
 * @name AppointmentsList
 * @summary Get all appointments for the authenticated user
 * @request GET:/appointments
 * @secure
 * @response `200` `{
    success?: boolean,
    appointments?: (Appointment)[],

}` List of appointments retrieved successfully
 * @response `401` `void` Unauthorized
 */
  appointmentsList = (params: RequestParams = {}) =>
    this.request<
      {
        success?: boolean;
        appointments?: Appointment[];
      },
      void
    >({
      path: `/appointments`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags Appointments
 * @name AppointmentsCreate
 * @summary Create a new appointment
 * @request POST:/appointments
 * @secure
 * @response `201` `{
    success?: boolean,
    appointment?: Appointment,

}` Appointment created successfully
 * @response `400` `void` Validation error
 * @response `401` `void` Unauthorized
 */
  appointmentsCreate = (data: CreateAppointmentBody, params: RequestParams = {}) =>
    this.request<
      {
        success?: boolean;
        appointment?: Appointment;
      },
      void
    >({
      path: `/appointments`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * @description Admin-only. Paginated and filtered server-side; day filters are read in clinic time (Asia/Almaty).
 *
 * @tags Appointments
 * @name AdminList
 * @summary Clinic-wide appointment listing (dashboard)
 * @request GET:/appointments/admin
 * @secure
 * @response `200` `{
    success?: boolean,
    items?: (Appointment)[],
    total?: number,
    page?: number,
    limit?: number,
    totalPages?: number,

}` Page of appointments
 * @response `401` `void` Unauthorized
 * @response `403` `void` Not an admin
 */
  adminList = (
    query?: {
      /** @default 1 */
      page?: number;
      /**
       * @max 100
       * @default 20
       */
      limit?: number;
      /** Patient name, IIN or phone — or a MIS appointment/patient/doctor id. */
      search?: string;
      status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
      telemedicine?: boolean;
      /** @format date */
      dateFrom?: string;
      /** @format date */
      dateTo?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        success?: boolean;
        items?: Appointment[];
        total?: number;
        page?: number;
        limit?: number;
        totalPages?: number;
      },
      void
    >({
      path: `/appointments/admin`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * @description Runs the same sweep as the background schedule, on demand. Answers with what the sweep did — how many local appointments were checked and how many changed.
 *
 * @tags Appointments
 * @name AdminSyncCreate
 * @summary Pull appointment statuses from MIS now (dashboard)
 * @request POST:/appointments/admin/sync
 * @secure
 * @response `200` `{
    success?: boolean,
    checked?: number,
    patients?: number,
    updated?: number,
    notFound?: number,
    failedPatients?: number,

}` Sweep result
 * @response `401` `void` Unauthorized
 * @response `403` `void` Not an admin
 */
  adminSyncCreate = (params: RequestParams = {}) =>
    this.request<
      {
        success?: boolean;
        checked?: number;
        patients?: number;
        updated?: number;
        notFound?: number;
        failedPatients?: number;
      },
      void
    >({
      path: `/appointments/admin/sync`,
      method: 'POST',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
   * No description
   *
   * @tags Appointments
   * @name AdminDetail
   * @summary One appointment, unscoped (dashboard)
   * @request GET:/appointments/admin/{id}
   * @secure
   * @response `200` `void` Appointment
   * @response `403` `void` Not an admin
   * @response `404` `void` Appointment not found
   */
  adminDetail = (id: string, params: RequestParams = {}) =>
    this.request<void, void>({
      path: `/appointments/admin/${id}`,
      method: 'GET',
      secure: true,
      ...params,
    });
  /**
 * No description
 *
 * @tags Appointments
 * @name AppointmentsDetail
 * @summary Get appointment by ID
 * @request GET:/appointments/{id}
 * @secure
 * @response `200` `{
    success?: boolean,
    appointment?: Appointment,

}` Appointment retrieved successfully
 * @response `401` `void` Unauthorized
 * @response `404` `void` Appointment not found
 */
  appointmentsDetail = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        success?: boolean;
        appointment?: Appointment;
      },
      void
    >({
      path: `/appointments/${id}`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags Appointments
 * @name AppointmentsUpdate
 * @summary Update an appointment
 * @request PUT:/appointments/{id}
 * @secure
 * @response `200` `{
    success?: boolean,
    message?: string,

}` Appointment updated successfully
 * @response `400` `void` Validation error
 * @response `401` `void` Unauthorized
 * @response `404` `void` Appointment not found
 */
  appointmentsUpdate = (id: string, data: UpdateAppointmentBody, params: RequestParams = {}) =>
    this.request<
      {
        success?: boolean;
        message?: string;
      },
      void
    >({
      path: `/appointments/${id}`,
      method: 'PUT',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags Appointments
 * @name AppointmentsDelete
 * @summary Delete an appointment
 * @request DELETE:/appointments/{id}
 * @secure
 * @response `200` `{
    success?: boolean,
    message?: string,

}` Appointment deleted successfully
 * @response `401` `void` Unauthorized
 * @response `404` `void` Appointment not found
 */
  appointmentsDelete = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        success?: boolean;
        message?: string;
      },
      void
    >({
      path: `/appointments/${id}`,
      method: 'DELETE',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
 * @tags Appointments
 * @name CancelPartialUpdate
 * @summary Cancel an appointment
 * @request PATCH:/appointments/{id}/cancel
 * @secure
 * @response `200` `{
    success?: boolean,
    message?: string,

}` Appointment cancelled successfully
 * @response `401` `void` Unauthorized
 * @response `404` `void` Appointment not found
 */
  cancelPartialUpdate = (id: string, params: RequestParams = {}) =>
    this.request<
      {
        success?: boolean;
        message?: string;
      },
      void
    >({
      path: `/appointments/${id}/cancel`,
      method: 'PATCH',
      secure: true,
      format: 'json',
      ...params,
    });
}
