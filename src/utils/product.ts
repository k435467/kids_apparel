import { IGetProductsCondition } from '@/app/api/products/route'
import { FieldType as ProductEditorFieldType } from '@/components/product/ProductEditor'
import { IDocProduct } from '@/types/database'
import { v4 as uuidv4 } from 'uuid'

export const makeGetProductsConditionAndValidate = (
  search: URLSearchParams,
): Required<Omit<IGetProductsCondition, 'name' | 'startTime' | 'endTime'>> &
  Pick<IGetProductsCondition, 'name' | 'startTime' | 'endTime'> => {
  const condition = {
    name: search.get('name') ?? undefined,
    startTime: search.get('startTime') ?? undefined,
    endTime: search.get('endTime') ?? undefined,
    page: parseInt(search.get('page') ?? '1'),
    size: parseInt(search.get('size') ?? '10'),
    sort: search.get('sort') ?? '_id',
    asc: parseInt(search.get('asc') ?? '-1') as 1 | -1,
  }
  if (condition.page < 1 || condition.size > 30) {
    throw new Error('Condition is invalid.')
  }
  return condition
}

export const makeProductPriceMinMax = (
  colors: ProductEditorFieldType['colors'],
  sizes: ProductEditorFieldType['sizes'],
  basePrice: ProductEditorFieldType['basePrice'],
) => {
  const priceAdjustMinMax = {
    color: {
      min: Math.min(...colors.map((v) => v.priceAdjust ?? 0)),
      max: Math.max(...colors.map((v) => v.priceAdjust ?? 0)),
    },
    size: {
      min: Math.min(...sizes.map((v) => v.priceAdjust ?? 0)),
      max: Math.max(...sizes.map((v) => v.priceAdjust ?? 0)),
    },
  }

  return {
    max: basePrice + priceAdjustMinMax.color.max + priceAdjustMinMax.size.max,
    min: basePrice + priceAdjustMinMax.color.min + priceAdjustMinMax.size.min,
  }
}

/**
 * Because the colors or sizes from DB might be an empty array,
 * init it with a default value for the `ProductEditor`.
 */
export const makeInitOfColorsOrSizes = (colorsOrSizes: IDocProduct['colors']) =>
  colorsOrSizes.length > 0
    ? colorsOrSizes
    : [
        {
          id: uuidv4(),
          name: '',
        },
      ]

/**
 * Because the colors or sizes from `ProductEditor` might be a default value,
 * correct it to an empty array before save into DB.
 */
export const makeColorsOrSizesDbValue = (colorsOrSizes: IDocProduct['colors']) =>
  colorsOrSizes[0].name.length === 0 ? [] : colorsOrSizes
