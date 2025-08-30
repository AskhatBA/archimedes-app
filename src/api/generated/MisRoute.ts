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
  CreateMISAppointmentBody,
  CreateMISPatientBody,
  MISAvailableSlots,
  MISBranch,
  MISDoctor,
  MISPatient,
  MISSpecialization,
} from './data-contracts';

export namespace Mis {
  /**
 * No description
 * @tags MIS
 * @name FindPatientList
 * @summary Find patient by phone number
 * @request GET:/mis/find-patient
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    patient?: MISPatient,

}` Patient found successfully
 * @response `401` `void` User not found or unauthorized
*/
  export namespace FindPatientList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      patient?: MISPatient;
    };
  }

  /**
 * No description
 * @tags MIS
 * @name CreatePatientCreate
 * @summary Create a new patient
 * @request POST:/mis/create-patient
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
  \** @example "Patient created" *\
    description?: string,

}` Patient created successfully
 * @response `401` `void` User not found or unauthorized
*/
  export namespace CreatePatientCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateMISPatientBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      /** @example "Patient created" */
      description?: string;
    };
  }

  /**
 * No description
 * @tags MIS
 * @name BranchesList
 * @summary Get medical branches from MIS
 * @request GET:/mis/branches
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    branches?: (MISBranch)[],

}` Branches fetched successfully
 * @response `401` `void` User not found or unauthorized
*/
  export namespace BranchesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      branches?: MISBranch[];
    };
  }

  /**
 * No description
 * @tags MIS
 * @name SpecializationsList
 * @summary Get medical specializations from MIS
 * @request GET:/mis/specializations
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    specializations?: (MISSpecialization)[],

}` Specializations fetched successfully
 * @response `401` `void` User not found or unauthorized
*/
  export namespace SpecializationsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Branch ID from MIS */
      branchId: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      specializations?: MISSpecialization[];
    };
  }

  /**
 * No description
 * @tags MIS
 * @name DoctorsList
 * @summary Get medical specializations from MIS
 * @request GET:/mis/doctors
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    doctors?: (MISDoctor)[],

}` Doctors fetched successfully
 * @response `401` `void` User not found or unauthorized
*/
  export namespace DoctorsList {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Branch ID from MIS */
      branchId: string;
      /** Specialization ID from MIS */
      specializationId: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      doctors?: MISDoctor[];
    };
  }

  /**
 * No description
 * @tags MIS
 * @name DoctorAvailableSlotsDetail
 * @summary Get medical specializations from MIS
 * @request GET:/mis/doctor/{doctorId}/available-slots
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    availableSlots?: MISAvailableSlots,

}` Slots fetched successfully
 * @response `401` `void` User not found or unauthorized
*/
  export namespace DoctorAvailableSlotsDetail {
    export type RequestParams = {
      /** Doctor ID from MIS */
      doctorId: string;
    };
    export type RequestQuery = {
      /** Start date */
      startDate: string;
      /** End date */
      endDate: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      availableSlots?: MISAvailableSlots;
    };
  }

  /**
 * No description
 * @tags MIS
 * @name CreateAppointmentCreate
 * @summary Create a new appointment
 * @request POST:/mis/create-appointment
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
  \** @example "Appointment created" *\
    description?: string,

}` Appointment created successfully
 * @response `401` `void` User not found or unauthorized
*/
  export namespace CreateAppointmentCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateMISAppointmentBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      /** @example "Appointment created" */
      description?: string;
    };
  }
}
