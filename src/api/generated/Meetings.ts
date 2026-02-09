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
import { ContentType, HttpClient, RequestParams } from './http-client';

export class Meetings<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
 * No description
 *
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
  meetingsCreate = (data: CreateMeetingBody, params: RequestParams = {}) =>
    this.request<
      {
        /** @example true */
        success?: boolean;
        meeting?: MeetingResponse;
      },
      void
    >({
      path: `/meetings`,
      method: 'POST',
      body: data,
      secure: true,
      type: ContentType.Json,
      format: 'json',
      ...params,
    });
}
