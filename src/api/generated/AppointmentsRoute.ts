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
