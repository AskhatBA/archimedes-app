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

import { CreateMeetingBody, MeetingResponse, RecordingResponse } from './data-contracts';

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

  /**
 * No description
 * @tags Meetings
 * @name RecordingsDetail
 * @summary Get recordings for a Zoom meeting
 * @request GET:/meetings/{meetingId}/recordings
 * @secure
 * @response `200` `{
  \** @example true *\
    success?: boolean,
    recordings?: RecordingResponse,

}` Recordings retrieved successfully
 * @response `400` `void` Bad Request - Invalid meeting ID
 * @response `401` `void` Unauthorized
 * @response `404` `void` Recording not found
*/
  export namespace RecordingsDetail {
    export type RequestParams = {
      /** The Zoom meeting ID */
      meetingId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      /** @example true */
      success?: boolean;
      recordings?: RecordingResponse;
    };
  }
}
