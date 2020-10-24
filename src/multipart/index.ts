import { FileMultiple } from './FileMultiple'
import { FileObject, FileObjectSchemaType } from './FileObject'
import { FileSingle } from './FileSingle'

export type FormDataFile = {
    fieldName: string
    originalFilename: string
    path: string
    headers: {
        'content-disposition': string
        'content-type': string
    }
    size: number
    name: string
    type: string
}

export class F {
    static single() {
        return new FileSingle()
    }
    static multiple() {
        return new FileMultiple()
    }
    static object(schema: FileObjectSchemaType) {
        return new FileObject(schema)
    }
}

export { FileMultiple, FileObjectSchemaType, FileSingle, FileObject }
