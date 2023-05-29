import { BrowserBreadcrumbTypes } from '@web-watch/shared'
import { getBreadcrumbCategoryInBrowser, Severity } from '@web-watch/utils'
import { BrowserClient } from './browserClient'

export function addBreadcrumbInBrowser(
  this: BrowserClient,
  data: any,
  type: BrowserBreadcrumbTypes,
  level = Severity.Info,
  params: any = {}
) {
  return this.breadcrumb.push({
    type,
    data,
    category: getBreadcrumbCategoryInBrowser(type),
    level,
    ...params
  })
}
