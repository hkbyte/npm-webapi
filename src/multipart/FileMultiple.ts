import { FormDataFile } from '.'
import _ from 'lodash'

type Validation = {
    optional?: boolean
    // allowTypes?: string[]
    // restrictTypes?: string[]
    // allowExtensions?: string[]
    // restrictExtensions?: string[]
}

export class FileMultiple {
    validation: Validation

    constructor() {
        this.validation = {}
    }

    optional() {
        this.validation.optional = true
        return this
    }

    parse(payload: unknown): FormDataFile[] | undefined {
        if (_.isUndefined(payload)) {
            if (!this.validation.optional) {
                throw new Error('required')
            }
        }
        if (!Array.isArray(payload)) {
            payload = [payload]
        }
        return payload as FormDataFile[]
    }
}
