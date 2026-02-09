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

import { CreateMeetingBody, MeetingResponse } from './data-contracts';

export namespace Meetings {
  /**
 * No description
 * @tags Meetings
 * @name MeetingsCreate
 * @summary Create a Zoom meeting
 * @request POST:/meetings
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    meeting?: MeetingResponse,

}` Meeting created successfully
 * @response `400` `void` Bad Request - Invalid input
 * @response `401` `void` Unauthorized
*/
  export namespace MeetingsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateMeetingBody;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      meeting?: MeetingResponse;
    };
  }
}
