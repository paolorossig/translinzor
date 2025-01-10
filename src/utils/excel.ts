import * as xlsx from 'xlsx'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>

export function downloadExcel(data: AnyObject[], fileName: string) {
  const worksheet = xlsx.utils.json_to_sheet(data)
  const workbook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(workbook, worksheet)
  xlsx.writeFile(workbook, fileName)
}

export function flattenObject(ob: AnyObject): AnyObject {
  const toReturn: AnyObject = {}
  for (const i in ob) {
    if (!ob.hasOwnProperty(i)) continue
    if (typeof ob[i] === 'object' && ob[i] !== null) {
      const flatObject = flattenObject(ob[i] as AnyObject)
      for (const x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        toReturn[i + '.' + x] = flatObject[x]
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      toReturn[i] = ob[i]
    }
  }
  return toReturn
}
