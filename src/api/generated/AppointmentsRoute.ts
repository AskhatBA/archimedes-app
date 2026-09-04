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

export namespace Appointments {
  /**
 * No description
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
  export namespace AppointmentsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      appointments?: Appointment[];
    };
  }

  /**
 * No description
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
  export namespace AppointmentsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateAppointmentBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      appointment?: Appointment;
    };
  }

  /**
 * @description Admin-only. Paginated and filtered server-side; day filters are read in clinic time (Asia/Almaty).
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
  export namespace AdminList {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      items?: Appointment[];
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
  }

  /**
 * @description Runs the same sweep as the background schedule, on demand. Answers with what the sweep did — how many local appointments were checked and how many changed.
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
  export namespace AdminSyncCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      checked?: number;
      patients?: number;
      updated?: number;
      notFound?: number;
      failedPatients?: number;
    };
  }

  /**
   * No description
   * @tags Appointments
   * @name AdminDetail
   * @summary One appointment, unscoped (dashboard)
   * @request GET:/appointments/admin/{id}
   * @secure
   * @response `200` `void` Appointment
   * @response `403` `void` Not an admin
   * @response `404` `void` Appointment not found
   */
  export namespace AdminDetail {
    export type RequestParams = {
      /** @format uuid */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
 * No description
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
  export namespace AppointmentsDetail {
    export type RequestParams = {
      /**
       * Appointment ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      appointment?: Appointment;
    };
  }

  /**
 * No description
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
  export namespace AppointmentsUpdate {
    export type RequestParams = {
      /**
       * Appointment ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateAppointmentBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      message?: string;
    };
  }

  /**
 * No description
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
  export namespace AppointmentsDelete {
    export type RequestParams = {
      /**
       * Appointment ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      message?: string;
    };
  }

  /**
 * No description
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
  export namespace CancelPartialUpdate {
    export type RequestParams = {
      /**
       * Appointment ID
       * @format uuid
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      success?: boolean;
      message?: string;
    };
  }
}
