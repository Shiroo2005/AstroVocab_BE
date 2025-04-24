import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CREATED, SuccessResponse } from '~/core/success.response'
import { CreateCourseBodyReq } from '~/dto/req/course/createCourseBody.req'
import { UpdateCourseBodyReq } from '~/dto/req/course/updateCourseBody.req'
import { getOrSetCache } from '~/middlewares/redis/redis.middleware'
import { courseService } from '~/services/course.service'
import { buildCacheKey } from '~/utils/redis'

export const createCourseController = async (
  req: Request<ParamsDictionary, any, CreateCourseBodyReq>,
  res: Response
) => {
  return new CREATED({
    message: 'Create new course successful!',
    metaData: await courseService.createCourse(req.body.courses)
  }).send(res)
}

export const updateCourseController = async (
  req: Request<ParamsDictionary, any, UpdateCourseBodyReq>,
  res: Response
) => {
  const id = req.idParams as number

  return new SuccessResponse({
    message: 'Update course by id successful!',
    metaData: await courseService.updateCourse(id, req.body)
  }).send(res)
}

export const getAllCoursesController = async (req: Request, res: Response) => {
  //build key for redis
  const key = buildCacheKey(req.baseUrl + req.path, { ...req.params, ...req.query })

  return new SuccessResponse({
    message: 'Get all courses successful!',
    metaData: await getOrSetCache(key, () =>
      courseService.getAllCourses({ ...req.query, ...req.parseQueryPagination, sort: req.sortParsed })
    )
  }).send(res)
}

export const getCourseController = async (req: Request, res: Response) => {
  const id = req.idParams as number

  //build key for redis
  const key = buildCacheKey(req.baseUrl + req.path, {})

  return new SuccessResponse({
    message: 'Get course by id successful!',
    metaData: await getOrSetCache(key, () => courseService.getCourseById({ id }))
  }).send(res)
}

export const deleteCourseController = async (req: Request, res: Response) => {
  const id = req.idParams as number

  return new SuccessResponse({
    message: 'Delete course by id successful!',
    metaData: await courseService.deleteCourseById({ id })
  }).send(res)
}

export const restoreCourseController = async (req: Request, res: Response) => {
  const id = req.idParams as number

  return new SuccessResponse({
    message: 'Restore course by id successful!',
    metaData: await courseService.restoreCourseById({ id })
  }).send(res)
}
