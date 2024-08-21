'use client';

import { siteConfig } from '@/lib/core/config';
import { RootState } from '@/lib/core/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Contest, ContestWithRecords } from '../types/contest';
import { BaseResponse } from '@/lib/core/types';

export interface SendLoginEmailParams {
  email: string;
}

export const contestApi = createApi({
  reducerPath: 'contestApi',

  tagTypes: ['Contests', 'ActiveContests', 'UpcomingContests', 'PastContests'],

  baseQuery: fetchBaseQuery({
    baseUrl: siteConfig.api.baseUrl,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getContests: builder.query<Contest[], void>({
      query: () => '/contests',
      transformResponse: (response: BaseResponse<Contest[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Contests', id } as const)),
              { type: 'Contests', id: 'LIST' },
            ]
          : [{ type: 'Contests', id: 'LIST' }],
    }),

    getContest: builder.query<Contest, string>({
      query: (id) => `/contests/${id}`,
      transformResponse: (response: BaseResponse<Contest>) => response.data,
      providesTags: (result, error, id) => [{ type: 'Contests', id }],
    }),

    getContestWithRecord: builder.query<ContestWithRecords, string>({
      query: (id) => `/contests/${id}/records`,
      transformResponse: (response: BaseResponse<ContestWithRecords>) =>
        response.data,
      providesTags: (result, error, id) =>
        result ? [{ type: 'Contests', id: result.contest.id }] : [],
    }),

    getActiveContest: builder.query<Contest, string>({
      query: (id) => `/active-contests/${id}`,
      transformResponse: (response: BaseResponse<Contest>) => response.data,
      providesTags: (result, error, id) => [{ type: 'ActiveContests', id }],
    }),

    getActiveContests: builder.query<Contest[], void>({
      query: () => '/active-contests',
      transformResponse: (response: BaseResponse<Contest[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ id }) => ({ type: 'ActiveContests', id } as const)
              ),
              { type: 'ActiveContests', id: 'LIST' },
            ]
          : [{ type: 'ActiveContests', id: 'LIST' }],
    }),

    getUpcomingContests: builder.query<Contest[], void>({
      query: () => '/upcoming-contests',
      transformResponse: (response: BaseResponse<Contest[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ id }) => ({ type: 'UpcomingContests', id } as const)
              ),
              { type: 'UpcomingContests', id: 'LIST' },
            ]
          : [{ type: 'UpcomingContests', id: 'LIST' }],
    }),

    getPastContests: builder.query<Contest[], void>({
      query: () => '/past-contests',
      transformResponse: (response: BaseResponse<Contest[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ id }) => ({ type: 'PastContests', id } as const)
              ),
              { type: 'PastContests', id: 'LIST' },
            ]
          : [{ type: 'PastContests', id: 'LIST' }],
    }),

    createContest: builder.mutation<any, SendLoginEmailParams>({
      query: (params) => ({
        url: '/contests',
        method: 'POST',
        body: params,
      }),
      transformResponse: (response: BaseResponse<Contest>) => response.data,
      invalidatesTags: [{ type: 'Contests', id: 'LIST' }],
    }),

    updateContest: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/contests/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: BaseResponse<Contest>) => response.data,
      invalidatesTags: (result, error, { id }) => [{ type: 'Contests', id }],
    }),

    deleteContest: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/contests/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: BaseResponse<Contest>) => response.data,
      invalidatesTags: (result, error, { id }) => [{ type: 'Contests', id }],
    }),
  }),
});

export const {
  useGetContestsQuery,
  useGetContestQuery,
  useGetContestWithRecordQuery,
  useGetActiveContestQuery,
  useGetActiveContestsQuery,
  useGetUpcomingContestsQuery,
  useGetPastContestsQuery,
  useCreateContestMutation,
  useUpdateContestMutation,
  useDeleteContestMutation,
} = contestApi;
