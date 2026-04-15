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
