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
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Mis<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * No description
 *
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
  findPatientList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        patient?: MISPatient;
      },
      void
    >({
      path: `/mis/find-patient`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  createPatientCreate = (data: CreateMISPatientBody, params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        /** @example "Patient created" */
        description?: string;
      },
      void
    >({
      path: `/mis/create-patient`,
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
  branchesList = (params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        branches?: MISBranch[];
      },
      void
    >({
      path: `/mis/branches`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  specializationsList = (
    query: {
      /** Branch ID from MIS */
      branchId: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        specializations?: MISSpecialization[];
      },
      void
    >({
      path: `/mis/specializations`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  doctorsList = (
    query: {
      /** Branch ID from MIS */
      branchId: string;
      /** Specialization ID from MIS */
      specializationId: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        doctors?: MISDoctor[];
      },
      void
    >({
      path: `/mis/doctors`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  doctorAvailableSlotsDetail = (
    doctorId: string,
    query: {
      /** Start date */
      startDate: string;
      /** End date */
      endDate: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        availableSlots?: MISAvailableSlots;
      },
      void
    >({
      path: `/mis/doctor/${doctorId}/available-slots`,
      method: 'GET',
      query: query,
      secure: true,
      format: 'json',
      ...params,
    });
  /**
 * No description
 *
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
  createAppointmentCreate = (data: CreateMISAppointmentBody, params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        /** @example "Appointment created" */
        description?: string;
      },
      void
    >({
      path: `/mis/create-appointment`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
